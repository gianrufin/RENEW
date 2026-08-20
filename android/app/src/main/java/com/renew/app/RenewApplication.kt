package com.renew.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.work.*
import com.renew.app.data.AppDatabase
import com.renew.app.data.TaskRepository
import com.renew.app.worker.DailyReminderWorker
import java.util.concurrent.TimeUnit

class RenewApplication : Application() {

    val database: AppDatabase by lazy { AppDatabase.getDatabase(this) }
    val repository: TaskRepository by lazy { TaskRepository(database.taskDao()) }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        scheduleDailyMorningWork()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Household Maintenance Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Daily reminders for overdue and upcoming maintenance tasks"
                enableVibration(true)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun scheduleDailyMorningWork() {
        val workRequest = PeriodicWorkRequestBuilder<DailyReminderWorker>(24, TimeUnit.HOURS)
            .setConstraints(
                Constraints.Builder()
                    .setRequiresBatteryNotLow(false)
                    .build()
            )
            .build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "RenewDailyMorningAlerts",
            ExistingPeriodicWorkPolicy.KEEP,
            workRequest
        )
    }

    companion object {
        const val CHANNEL_ID = "renew_maintenance_alerts"
    }
}
