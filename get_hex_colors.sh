grep -oE "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})" src/css/styles.css | sort | uniq -c | sort -nr
