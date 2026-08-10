MYSQLDUMP_OPTIONS="-u root --host 127.0.0.1 --port 60003 -pxs2mysql"

DATABASES_TO_EXCLUDE="phpmyadmin"
EXCLUSION_LIST="'information_schema','mysql','performance_schema','sys'"
for DB in `echo "${DATABASES_TO_EXCLUDE}"`
do
    EXCLUSION_LIST="${EXCLUSION_LIST},'${DB}'"
done

SQLSTMT="SELECT schema_name FROM information_schema.schemata"
SQLSTMT="${SQLSTMT} WHERE schema_name NOT IN (${EXCLUSION_LIST})"
MYSQLDUMP_DATABASES="--databases"
for DB in `mysql ${MYSQLDUMP_OPTIONS} -ANe"${SQLSTMT}"`
do
    MYSQLDUMP_DATABASES="${MYSQLDUMP_DATABASES} ${DB}"
done

echo "Dumping schema information..."
mysqldump ${MYSQLDUMP_OPTIONS} --skip-add-locks --compact --skip-comments --add-drop-table --no-data --column-statistics=0 ${MYSQLDUMP_DATABASES} > MySQLDatabases.sql

echo "Dumping migrations tables..."
for DB in `mysql ${MYSQLDUMP_OPTIONS} -ANe"${SQLSTMT}"`
do
    data=$(mysqldump ${MYSQLDUMP_OPTIONS} --complete-insert --skip-add-locks --skip-disable-keys --compact --skip-comments --skip-add-drop-table --no-create-db --no-create-info --column-statistics=0 ${DB} migrations 2> /dev/null)
    # if migrations exist, then create the query
    if [ ! -z "$data" ]; then
        echo "USE ${DB};" >> MySQLDatabases.sql
        echo "$data" >> MySQLDatabases.sql 
    fi
done

echo "Done!"
