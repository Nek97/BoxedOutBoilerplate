SERVICE=$1

echo $SERVICE
   
NEXT_WAIT_TIME=0
COMMAND_STATUS=1

until [[ $COMMAND_STATUS -eq 0 || $NEXT_WAIT_TIME -eq 15 ]]; do
  if [ -z `docker compose ps -q $SERVICE` ] || [ -z `docker ps -q --no-trunc --filter "health=healthy" | grep $(docker compose ps -q $SERVICE)` ]; then
    COMMAND_STATUS=1
    echo "not healthy...retry..."
    sleep $NEXT_WAIT_TIME
  else
    COMMAND_STATUS=0
    echo "healthy!"
    exit 0
  fi

  let NEXT_WAIT_TIME=NEXT_WAIT_TIME+1
done

exit 1
