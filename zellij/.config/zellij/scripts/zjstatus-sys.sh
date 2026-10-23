#!/bin/bash
# System stats for the zjstatus bar. Usage: zjstatus-sys.sh uptime|cpu|mem
# zjstatus runs commands without a shell, so the logic lives here.

case "$1" in
  uptime)
    # kern.boottime looks like "{ sec = 1792695594, usec = 0 } ..."
    boot=$(/usr/sbin/sysctl -n kern.boottime | /usr/bin/awk -F'[ ,]+' '{print $4}')
    s=$(( $(/bin/date +%s) - boot ))
    d=$(( s / 86400 )); h=$(( s % 86400 / 3600 )); m=$(( s % 3600 / 60 ))
    if (( d > 0 )); then printf '%dd %dh' "$d" "$h"; else printf '%dh %dm' "$h" "$m"; fi
    ;;
  cpu)
    # Sum of per-process CPU divided by core count. Must return instantly:
    # zjstatus re-runs commands that haven't finished, so slow ones pile up
    # (top -l 2 did, and pushed the load average past 200).
    ncpu=$(/usr/sbin/sysctl -n hw.ncpu)
    /bin/ps -A -o %cpu= | /usr/bin/awk -v n="$ncpu" '{s += $1} END {v = s / n; if (v > 100) v = 100; printf "%d%%", v}'
    ;;
  mem)
    # Matches Activity Monitor's "Memory Used": app (anonymous - purgeable) + wired + compressed
    total=$(/usr/sbin/sysctl -n hw.memsize)
    /usr/bin/vm_stat | /usr/bin/awk -v total="$total" '
      /page size of/              { ps = $8 }
      /Anonymous pages/           { anon = $3 }
      /Pages purgeable/           { purg = $3 }
      /Pages wired down/          { wired = $4 }
      /occupied by compressor/    { comp = $5 }
      END {
        used = (anon - purg + wired + comp) * ps / 1073741824
        printf "%.1f/%dG", used, total / 1073741824
      }'
    ;;
esac
