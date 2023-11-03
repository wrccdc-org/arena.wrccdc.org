#!/bin/bash

# Pull from Git
if [ ! -z "$1" ]; then
	git stash || echo "no stash"
	git reset --hard HEAD || echo "no reset"
	git pull origin main
fi

# Path to your competitions.json file
json_file="competition.json"

# Get the current date in the same format as the JSON file
current_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Parse the JSON file and loop through the events
events=$(jq -c '.[]' "$json_file")

event_in_range=0

while IFS= read -r event; do
  start_time=$(jq -r '.startTime' <<< "$event")
  end_time=$(jq -r '.endTime' <<< "$event")

  if [[ "$current_date" > "$start_time" && "$current_date" < "$end_time" ]]; then
    echo "The current date is within the specified range for the event:"
    event_in_range=1
    break
  else 
    echo "$current_date not between $start_time to $end_time"
  fi
done <<< "$events"

if [ $event_in_range -eq 0 ]; then
  echo "Date is not matched"
  echo "# empty" > /etc/nginx/conf.d/area-score-file.conf
else
  cat << 'EOF' > /etc/nginx/conf.d/area-score-file.conf
location ~* (team_services.jpg|team_scores.jpg) {
  auth_basic off;
  allow all;
}
EOF
fi

# Reload nginx to set changes
nginx -s reload
