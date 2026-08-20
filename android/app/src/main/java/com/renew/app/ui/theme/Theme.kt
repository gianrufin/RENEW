package com.renew.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = NeonOrange,
    onPrimary = Color.Black,
    primaryContainer = NeonOrange.copy(alpha = 0.2f),
    onPrimaryContainer = NeonOrange,
    secondary = Color.White,
    background = DarkBackground,
    surface = DarkSurface,
    surfaceVariant = DarkCard,
    outline = DarkBorder,
    onBackground = TextPrimaryDark,
    onSurface = TextPrimaryDark,
    onSurfaceVariant = TextSecondaryDark
)

private val LightColorScheme = lightColorScheme(
    primary = NeonOrange,
    onPrimary = Color.White,
    primaryContainer = NeonOrange.copy(alpha = 0.1f),
    onPrimaryContainer = NeonOrange,
    secondary = Color.Black,
    background = LightBackground,
    surface = LightSurface,
    surfaceVariant = LightCard,
    outline = LightBorder,
    onBackground = TextPrimaryLight,
    onSurface = TextPrimaryLight,
    onSurfaceVariant = TextSecondaryLight
)

@Composable
fun RenewTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
