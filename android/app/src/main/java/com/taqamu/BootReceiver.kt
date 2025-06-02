package com.taqamu

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log
import java.text.SimpleDateFormat
import java.util.*

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED && context != null) {
            Log.d("BootReceiver", "📱 Device rebooted — rescheduling notifications...")

            val prefs: SharedPreferences = context.getSharedPreferences("prayer_prefs", Context.MODE_PRIVATE)
            val jsonString = prefs.getString("prayer_times", null)

            if (jsonString != null) {
                val prayerTimes = parsePrayerTimes(jsonString)

                for ((prayerName, time) in prayerTimes) {
                    schedulePrayerNotification(context, prayerName, time)
                }
            } else {
                Log.d("BootReceiver", "⚠️ No prayer times found in SharedPreferences.")
            }
        }
    }

    private fun parsePrayerTimes(jsonString: String): Map<String, String> {
        // Simple manual parse assuming correct format: {"Fajr":"05:00", "Dhuhr":"12:30", ...}
        return jsonString
            .replace("{", "")
            .replace("}", "")
            .replace("\"", "")
            .split(",")
            .map { it.trim().split(":").let { k -> k[0] to (k[1] + ":" + k[2]) } }
            .toMap()
    }

    private fun schedulePrayerNotification(context: Context, prayerName: String, timeStr: String) {
        try {
            val formatter = SimpleDateFormat("HH:mm", Locale.getDefault())
            val calendar = Calendar.getInstance()

            val time = formatter.parse(timeStr)
            if (time != null) {
                calendar.time = time
                val now = Calendar.getInstance()
                calendar.set(now.get(Calendar.YEAR), now.get(Calendar.MONTH), now.get(Calendar.DAY_OF_MONTH))

                if (calendar.before(now)) {
                    calendar.add(Calendar.DATE, 1) // Schedule for next day if time has passed
                }

                val intent = Intent(context, NotificationReceiver::class.java).apply {
                    putExtra("prayer_name", prayerName)
                }

                val pendingIntent = PendingIntent.getBroadcast(
                    context,
                    prayerName.hashCode(),
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )

                val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)

                Log.d("BootReceiver", "✅ Scheduled $prayerName at ${calendar.time}")
            }
        } catch (e: Exception) {
            Log.e("BootReceiver", "❌ Failed to schedule $prayerName: ${e.message}")
        }
    }
}
