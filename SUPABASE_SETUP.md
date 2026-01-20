# Supabase Setup Guide for Family Survey App

## Prerequisites
- Flutter SDK installed
- Supabase account (free tier available at supabase.com)
- Android Studio or VS Code for development

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `family-survey-app`
   - Database Password: Choose a strong password
   - Region: Select closest to your location
4. Wait for project creation (takes 2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure the App

1. Open `lib/services/supabase_service.dart`
2. Replace the placeholder values:
   ```dart
   static const String supabaseUrl = 'https://your-project-id.supabase.co';
   static const String supabaseAnonKey = 'your-anon-key-here';
   ```

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the entire content from `schema.sql`
3. Click "Run" to create all tables

## Step 5: Configure Authentication

1. In Supabase dashboard, go to Authentication → Settings
2. Configure phone authentication:
   - Enable "Enable phone confirmations"
   - Set SMS provider (Twilio recommended for production)
3. For development, you can use the test phone numbers in Auth → Users

## Step 6: Enable Row Level Security (RLS)

Run these SQL commands in the SQL Editor to secure your data:

```sql
-- Enable RLS on all tables
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_holding ENABLE ROW LEVEL SECURITY;
-- ... enable RLS on all other tables

-- Create policies for authenticated users
CREATE POLICY "Users can view their own surveys" ON surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own surveys" ON surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" ON surveys
    FOR UPDATE USING (auth.uid() = user_id);

-- Repeat similar policies for all related tables
CREATE POLICY "Users can view their own family details" ON family_details
    FOR ALL USING (
        survey_id IN (
            SELECT id FROM surveys WHERE user_id = auth.uid()
        )
    );
```

## Step 7: Test the Setup

1. Run the app: `flutter run`
2. Try phone authentication
3. Complete a survey to test data sync
4. Check Supabase dashboard to verify data is being stored

## Step 8: Production Deployment

### For Android APK:
```bash
flutter build apk --release
```

### For Play Store:
1. Create a keystore: `keytool -genkey -v -keystore key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key`
2. Update `android/app/build.gradle` with signing config
3. Build: `flutter build apk --release`

## Troubleshooting

### Common Issues:

1. **"Failed to sync survey" error:**
   - Check internet connection
   - Verify Supabase credentials
   - Check RLS policies

2. **Phone authentication not working:**
   - Verify SMS provider configuration
   - Check if phone number format is correct (+91XXXXXXXXXX)

3. **Database connection issues:**
   - Verify project URL and anon key
   - Check if tables were created correctly

### Debug Mode:
Add this to your `main.dart` for debugging:
```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Enable Supabase logging
  Supabase.initialize(
    url: 'your-url',
    anonKey: 'your-key',
    debug: true, // Add this for debug logs
  );

  runApp(const MyApp());
}
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for different environments
3. **Enable RLS** on all tables
4. **Regular backup** of Supabase data
5. **Monitor usage** in Supabase dashboard

## Cost Optimization

- **Free tier** includes 500MB database, 50MB file storage
- **Monitor usage** to avoid unexpected charges
- **Clean up test data** regularly

## Support

- Supabase Documentation: https://supabase.com/docs
- Flutter Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/flutter
- Community Discord: https://supabase.com/discord
