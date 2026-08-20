package com.renew.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.renew.app.ui.theme.NeonOrange
import com.renew.app.viewmodel.TaskViewModel

@Composable
fun SettingsScreen(
    viewModel: TaskViewModel,
    onOpenBriefing: () -> Unit
) {
    val tasks by viewModel.tasks.collectAsState()
    var dailyNotificationsEnabled by remember { mutableStateOf(true) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MaterialTheme.colorScheme.outline)
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = "SETTINGS & STORAGE.",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "Manage system notifications, daily morning alerts, and offline Room database persistence.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Daily Morning Briefing
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(0.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("MORNING BRIEFING", style = MaterialTheme.typography.labelSmall, color = NeonOrange)
                    Text("Open full-screen morning summary briefing with quick actions for today.", style = MaterialTheme.typography.bodyMedium)
                    Button(
                        onClick = onOpenBriefing,
                        shape = RoundedCornerShape(0.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = NeonOrange, contentColor = Color.Black)
                    ) {
                        Text("LAUNCH BRIEFING NOW", fontWeight = FontWeight.Black)
                    }
                }
            }
        }

        // Notifications
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(0.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("DAILY ALERT NOTIFICATIONS", style = MaterialTheme.typography.titleMedium)
                        Text("WorkManager 24h background checks", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Switch(
                        checked = dailyNotificationsEnabled,
                        onCheckedChange = { dailyNotificationsEnabled = it }
                    )
                }
            }
        }

        // Local SQLite Room Stats
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(0.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("LOCAL ROOM SQLITE DATABASE", style = MaterialTheme.typography.labelSmall, color = NeonOrange)
                    Text("• Total Tracked Schedules: ${tasks.size}", style = MaterialTheme.typography.bodyMedium)
                    Text("• Offline Storage: 100% On-Device (No cloud account required)", style = MaterialTheme.typography.bodyMedium)
                    Text("• Application Version: 1.0.0 (Kotlin Jetpack Compose)", style = MaterialTheme.typography.bodyMedium)
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(72.dp))
        }
    }
}
