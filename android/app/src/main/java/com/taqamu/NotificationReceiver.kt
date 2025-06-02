package com.taqamu

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class NotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val prayerName = intent.getStringExtra("prayer_name") ?: "Prayer"

        val notification = NotificationCompat.Builder(context, "prayer-times")
            .setContentTitle("$prayerName Time")
            .setContentText("It's time for $prayerName prayer")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        with(NotificationManagerCompat.from(context)) {
            notify(prayerName.hashCode(), notification)
        }

        Log.d("NotificationReceiver", "🔔 Notification shown for $prayerName")
    }
}
