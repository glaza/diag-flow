#!/bin/bash
#
# Use this script to update SeriesInstanceUID in serieslevel table of DicomExtern schema
#
StudyInstanceUID=$1
declare -l databaseMode=$2

updateDicomExternSeriesLevelTable() {

        series_uid=$1
        original_Series_uid=$2
        dxshost=$(getControlValue --file /usr/local/tools/control_files/GlobalDatabases.cfg --section DATABASE_DICOMEXTERN --key PRIMARY_HOST | cut -d ',' -f1)
        export PGPASSWORD=$(getControlValue --file /usr/local/tools/control_files/GlobalDatabases.cfg --section POSTGRES_ACCESS --key DATABASE_SAPASSWORD)

        psql-intelerad -h $dxshost -Usa -D dicomextern -c "select ser_ins_uid_ims,ser_ins_uid_orig from dicomextern.serieslevel where stu_ins_uid = '$StudyInstanceUID'" | while read -r ser_ins_uid_ims ser_ins_uid_orig; do

                if [[ ${ser_ins_uid_ims} =~ ^[0-9*.]+$ ]]; then
                        echo "Series_ins_uid_ims in dicomextern : $ser_ins_uid_ims"
                        set -- $ser_ins_uid_orig
                        dicomextern_original_series_uid=$2
                        echo "ser_ins_uid_orig in dicomextern : $dicomextern_original_series_uid"

                        if [[ "$dicomextern_original_series_uid" == "$original_Series_uid" ]] && [[ "$ser_ins_uid_ims" == "$original_Series_uid" ]]; then

                                echo $(psql-intelerad -h $dxshost -Usa -D dicomextern -c "update dicomextern.serieslevel set ser_ins_uid_ims = '$series_uid' where stu_ins_uid = '$StudyInstanceUID' and ser_ins_uid_orig='$dicomextern_original_series_uid'")
                                break
                        fi
                fi
        done
}

updateSybaseDicomMasterDB() {
        if [[ $StudyInstanceUID =~ ^[0-9*.]+$ ]]; then
                declare -a seriesInstanceUIDList
                read -ra seriesInsUidList <<<$(sqsh -D DicomMaster -C "select SerInsUID,SerInsUIDOrig from SeriesLevel ( INDEX StuParentIndex ) where StuParent ='$StudyInstanceUID'")

                for i in "${seriesInsUidList[@]}"; do
                        if [[ ${i} =~ ^[0-9*.]+$ ]]; then
                                seriesInstanceUIDList+=($i)
                        fi
                done

                if [ ${#seriesInstanceUIDList[@]} -eq 0 ]; then
                        echo "No records found for $StudyInstanceUID in SeriesLevel table of DicomMaster database"
                else
                        echo "final serieslist : ${seriesInstanceUIDList[@]}"
                fi

                for ((i = 0; i < ${#seriesInstanceUIDList[*]}; $((i + 2)))); do
                        if [[ ${seriesInstanceUIDList[i]} != ${seriesInstanceUIDList[i + 1]} ]]; then
                                echo "remapped SerInsUID in DicomMaster : ${seriesInstanceUIDList[i]}"
                                echo "Original SerInsUID in DicomMaster: ${seriesInstanceUIDList[i + 1]}"
                                updateDicomExternSeriesLevelTable ${seriesInstanceUIDList[i]} ${seriesInstanceUIDList[i + 1]}
                        fi
                        i=$((i + 2))
                done
        else
                echo "Please enter a valid StudyInstanceUID"
        fi
}

updatePostgresDicomMasterDB() {
        if [[ $StudyInstanceUID =~ ^[0-9*.]+$ ]]; then

                read -ra seriesInsUidList <<<$(psql-intelerad -D dicomevidence -c "select series_uid,series_uid_orig from dicomevidence.series where study_uid='$StudyInstanceUID'")

                for i in "${seriesInsUidList[@]}"; do
                        if [[ ${i} =~ ^[0-9*.]+$ ]]; then
                                seriesInstanceUIDList+=($i)
                        fi
                done

                if [ ${#seriesInstanceUIDList[@]} -eq 0 ]; then
                        echo "No records found for $StudyInstanceUID in SeriesLevel table of dicomevidence database"
                else
                        echo "final serieslist : ${seriesInstanceUIDList[@]}"

                        psql-intelerad -D dicomevidence -c "select series_uid,series_uid_orig from dicomevidence.series where study_uid='$StudyInstanceUID'" | while read -r series_uid series_uid_orig; do
                                set -- $series_uid_orig
                                dicomevidence_original_Series_uid=$2
                                if [[ ${series_uid} =~ ^[0-9*.]+$ ]] && [[ $series_uid != $dicomevidence_original_Series_uid ]]; then
                                        echo "SeriesInstanceUID in DicomEvidence table : $series_uid"
                                        set -- $series_uid_orig
                                        dicomevidence_original_Series_uid=$2
                                        echo "Original SeriesInstanceUID in DicomEvidence Table : $dicomevidence_original_Series_uid"
                                        updateDicomExternSeriesLevelTable ${series_uid} ${dicomevidence_original_Series_uid}
                                fi
                        done
                fi
        else
                echo "Please enter a valid StudyInstanceUID"
        fi

}

if [[ $databaseMode == "sybase" ]]; then

        echo "DicomMaster is in sybase mode"
        updateSybaseDicomMasterDB

elif [[ $databaseMode == "postgres" ]]; then
        echo "DicomMaster is in postgres mode"
        updatePostgresDicomMasterDB

else
        echo "Enter valid Database mode"
fi
