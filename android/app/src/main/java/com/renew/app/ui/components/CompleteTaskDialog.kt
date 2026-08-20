package com.renew.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.renew.app.data.TaskEntity
import com.renew.app.ui.theme.NeonOrange

@Composable
fun CompleteTaskDialog(
    task: TaskEntity,
    onConfirm: (cost: Double?, notes: String?, performer: String?) -> Unit,
    onDismiss: () -> Unit
) {
    var costText by remember { mutableStateOf(if (task.estimatedCost > 0) task.estimatedCost.toString() else "") }
    var notesText by remember { mutableStateOf("") }
    var performerText by remember { mutableStateOf("Me") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(0.dp),
            color = MaterialTheme.colorScheme.background,
            border = BorderStroke(2.dp, NeonOrange)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    text = "LOG MAINTENANCE COMPLETE",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.bodyMedium,
                    color = NeonOrange
                )

                OutlinedTextField(
                    value = costText,
                    onValueChange = { costText = it },
                    label = { Text("Actual Cost ($)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(0.dp)
                )

                OutlinedTextField(
                    value = performerText,
                    onValueChange = { performerText = it },
                    label = { Text("Serviced By") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(0.dp)
                )

                OutlinedTextField(
                    value = notesText,
                    onValueChange = { notesText = it },
                    label = { Text("Notes / Part Model / Receipt") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3,
                    shape = RoundedCornerShape(0.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(0.dp)
                    ) {
                        Text("CANCEL")
                    }
                    Button(
                        onClick = {
                            val cost = costText.toDoubleOrNull()
                            onConfirm(cost, notesText.ifBlank { null }, performerText.ifBlank { null })
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(0.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = NeonOrange, contentColor = Color.Black)
                    ) {
                        Text("SAVE LOG", fontWeight = FontWeight.Black)
                    }
                }
            }
        }
    }
}
