# Google Play Compliance for React Native AI Apps (2026)

## Policy & Distribution Requirements  
Your app must follow Google’s Developer Program Policies and Distribution Agreement. For example, new apps and updates must target **Android 15 (API level 35)** or higher as of Aug 31, 2025【1†L37-L45】, and your AndroidManifest’s `targetSdkVersion` (in `android/app/build.gradle`) should reflect this.  All apps must be **signed** with a valid release key (or use Google Play App Signing) before upload【8†L76-L84】.  You must keep your Play Console listing information up to date and truthful【32†L80-L88】.  Violating any content, behavior or security/privacy policy can cause immediate rejection or removal【3†L217-L223】. 

## Content & Behavior Guidelines  
Follow all content policies. Do **not** include prohibited content (hate, violence, illicit behavior, explicit sexual content, etc.) and be especially cautious with AI-generated output【6†L51-L59】. Apps that generate AI content must filter disallowed material and offer users an in-app flagging/reporting feature【6†L51-L59】【6†L60-L63】.  Do not infringe IP or clone other apps【29†L135-L144】.  Ensure any trademarks, copyrighted images/music, or brand names have permission.  The UI and app data should not mislead users (e.g. don’t show fake notifications or use deceptive UI).  If the app is aimed at children, follow the Families policy (content ratings, COPPA, etc.)【3†L386-L392】.  

## Permissions & Sensitive APIs  
Only request permissions that are **essential for core features**【5†L43-L51】【5†L51-L59】.  Use Android’s *runtime permission* prompts via React Native (e.g. `PermissionsAndroid` or `react-native-permissions`) to request “dangerous” permissions, and always explain why you need them【5†L61-L69】.  For example, before accessing location or microphone, show a clear rationale dialog.  Avoid pre-declaring permissions you don’t use: remove unused sensitive permissions from your manifest, or the Play review will reject you【14†L43-L46】.  Request permissions *incrementally* (only when the user triggers the related feature), and handle denials gracefully (don’t crash; provide an alternative)【5†L109-L117】.  Adhere to the Sensitive Data policy: treat data like location, contacts, camera, microphone, SMS, etc. as “personal and sensitive”【4†L64-L71】, encrypt it in transit (HTTPS)【4†L77-L80】, and never sell it【4†L85-L89】. If your use of sensitive data isn’t obvious to users, include a **prominent in-app disclosure** explaining what data is collected and why, then obtain explicit consent【4†L99-L110】【4†L114-L122】. For example, you might display a dialog: *“This app collects your voice for speech recognition to enable the chatbot feature. Do you allow this?”* with **Accept**/ **Decline** buttons【4†L114-L122】. 

Some permissions have extra rules. In particular, **storage access** has new restrictions: do *not* request broad external storage (`MANAGE_EXTERNAL_STORAGE`) unless your app’s core function is file management/backup/etc. and you complete the Play Console **Permissions Declaration Form**【14†L43-L46】【14†L79-L87】. Otherwise, remove this permission from your manifest【14†L43-L46】. For photos/videos, Google now requires that apps needing only *occasional* media access use the system photo picker instead of requesting `READ_MEDIA_IMAGES`/`READ_MEDIA_VIDEO`【27†L74-L83】【27†L127-L136】. Only image/video editors or gallery apps (core media functions) may keep those permissions, and even then you must pass a declaration review【27†L74-L83】【27†L127-L136】. For example, uploading a profile picture is considered one-time use and should use a picker【27†L127-L136】.  

Also respect **restricted permissions** (e.g. contacts, SMS, call logs, usage stats). For instance, SMS or Call-Log permissions require your app to be the default messaging/phone app and absolutely necessary; otherwise you cannot declare them【5†L125-L133】. If you do request a restricted permission, implement alternative behavior for users who deny it, and never coerce consent【5†L88-L97】【5†L109-L117】. In general, follow the Play guidance for each sensitive API (e.g. location *Background* access requires explicit permission and clear need).

## Privacy, User Data & Consent  
Be transparent about all user data collection. **Privacy Policy:** provide a comprehensive privacy policy URL (listed on your store page and accessible in-app) that details *exactly* what user data you collect, why, and how it’s stored/shared【33†L95-L98】. Google requires a Privacy Policy if you handle any personal/sensitive data. In that policy and in your Data Safety form, declare all data types your app collects or shares【21†L130-L133】【33†L95-L101】. For example, explain “We collect voice input to process responses” or “We access location to provide location-based reminders.” If you collect no user data, say so explicitly.

Complete the Play Console **Data Safety** questionnaire accurately.  This means selecting every data category that your app collects (e.g. “Voice or audio info,” “Location,” “Contacts,” etc.) and describing its usage. You cannot underreport; reviewers check your code and libraries against your declarations. A missing Privacy Policy or mismatch in the Data Safety section is a common cause for rejection【22†L97-L104】【33†L95-L101】. As Google notes, you must add a privacy policy to **enable** and show your Data Safety section【21†L130-L133】. 

Follow data minimization: only collect what the app needs【33†L112-L117】. For any personal data stored on device or servers, use strong security (HTTPS, encryption, private storage)【4†L77-L80】【33†L115-L117】. Never sell or share data without explicit user consent【4†L85-L89】【33†L119-L121】. If your app shares data with third parties (analytics, ads networks, etc.), disclose that purpose. For instance, if using an analytics SDK, note in your policy that “We share usage statistics with XYZ Analytics”.  If your app does *not* share or sell data, you can state that explicitly for clarity【33†L119-L121】.

## AI-Generated Content Requirements  
Since your app uses generative AI, extra care is needed. All AI output must still comply with existing content rules【6†L51-L59】. For example, the app must filter or block any AI output that could exploit children or enable illicit behavior【6†L51-L59】. Implement moderation safeguards (use content filters or review mechanisms). Importantly, include an **in-app feedback/report tool** so users can flag inappropriate content without leaving the app【6†L60-L63】. These reports should help you refine your filters. In summary, treat AI-generated text/images like user-generated content: enforce content policies, allow user reporting, and be prepared to remove or filter violative content【6†L51-L59】【6†L60-L63】. 

Also disclose to users how the AI uses their inputs. For example, if user voice or personal data is sent to a server for AI processing, mention that in your disclosures. This ensures compliance with transparency requirements.

## Third-Party SDKs & Libraries  
Any third-party code (libraries, SDKs, ads, analytics) you include must also comply with policies【7†L43-L52】【7†L62-L70】. For each SDK, know what data it accesses or collects. For instance, an ML/AI SDK might send data to its cloud, or an ad SDK may collect device identifiers. You must honor the same privacy rules for data accessed by SDKs【7†L43-L52】. In your Data Safety form, list data collected *by third-party libraries* as well【21†L136-L144】. Remove or replace any library that collects excessive or sensitive data you don’t need【33†L107-L110】. Remember that using an SDK that sells user data or violates Google’s policies can get your app removed (even if your own code is fine).

## Store Listing & Metadata  
The app’s Play Store listing must accurately represent the app. Provide a clear, well-written title (≤30 characters) and description【34†L36-L44】. Do not use emojis, all-caps (unless part of brand), special symbols, or promotional claims (like “#1 app”) in the title, icon, or developer name【34†L44-L52】. The description should clearly explain your app’s purpose and features without spammy keywords【34†L36-L44】【34†L104-L112】. Avoid placeholder text (“lorem ipsum”) or irrelevant content. Screenshots and videos must match the actual UI and not contain inappropriate imagery【34†L88-L97】. Provide a valid privacy policy URL and accurate contact information in the listing.

If your app requires login or credentials, **provide a demo/test account** in the Play Console so reviewers can sign in. Otherwise reviewers may reject your app for “broken functionality”【31†L165-L174】【31†L285-L294】.  Also select the correct content rating and target audience; if your app isn’t meant for children, don’t falsely claim it is, and vice versa.

## Functionality & Quality  
Your app must work reliably. Remove any **bugs, crashes, or incomplete features** before submission【31†L265-L273】【31†L287-L296】. Google’s review uses automated tests on multiple devices to catch crashes and ANRs【31†L265-L273】. Test thoroughly for stability and performance (e.g. no freeze on launch, all advertised features function, UI elements responsive). Ensure the app supports a reasonable range of devices and orientations, or limit device compatibility in the manifest if needed. Remove any debug or test code, clear console logs, and don’t ship unfinished UI (no “coming soon” screens). An app that feels like a “half-baked beta” will be rejected【31†L287-L296】.

## Pre-Submission Checklist  
Before uploading, verify all of the following:  
- **Target SDK**: Set `targetSdkVersion` to 35 (Android 15) and test on a modern OS【1†L37-L45】.  
- **Signing**: Build and sign a **release** APK/AAB using your upload key【8†L76-L84】. Do not ship a debug build.  
- **Permissions**: Check your AndroidManifest (`android/app/src/main/AndroidManifest.xml`) and remove any permissions not strictly needed. For each sensitive permission left, ensure you have user-facing justification ready. Use runtime requests in code (e.g. React Native’s `PermissionsAndroid.request`) as needed【5†L61-L69】.  
- **Photo/Video**: If your app uses camera or image picker, prefer the Android photo picker API for non-core tasks; only keep `READ_MEDIA_IMAGES`/`READ_MEDIA_VIDEO` if photo/video is a central feature【27†L74-L83】【27†L127-L136】.  
- **All Files Access**: Confirm you do *not* declare `MANAGE_EXTERNAL_STORAGE` unless you have a qualifying use case and completed the declaration【14†L43-L46】【14†L79-L87】.  
- **Privacy Policy**: Have a complete Privacy Policy URL in your Play Store listing【33†L95-L98】, and optionally linked in-app (e.g. in an “About” screen). The policy must describe all data collection and use.  
- **Data Safety Form**: Fill out the Data Safety section in Play Console, disclosing every data type used by your app and third-party libraries【21†L130-L133】【33†L100-L105】.  
- **Content Review**: Check that all content and metadata comply with policies: no disallowed imagery or language in screenshots/listing【34†L88-L97】; no placeholder text.  
- **Accessibility of Features**: Provide test credentials if needed. Ensure login or essential features are accessible to reviewers.  
- **App Quality**: Run your app through Google’s *pre-launch report* (available in Play Console under Testing) to catch crashes. Verify performance is smooth and navigation works.  
- **Backup & Misc**: If using cloud backups or external APIs, follow those policies (e.g. Structured Data, if any). Include attribution if using open-source libraries (with their licenses).

## Sample Configurations  

**AndroidManifest.xml (React Native)** – declare only necessary permissions, using proper namespace:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android" 
    package="com.example.app">
  <uses-sdk android:targetSdkVersion="35" android:minSdkVersion="21"/>
  <!-- Internet (e.g. for API calls) -->
  <uses-permission android:name="android.permission.INTERNET" />
  <!-- Example dangerous permissions with core-use justification -->
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.CAMERA" />
  <!-- Microphone, if using voice input -->
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <!-- No READ_SMS, etc., unless app is default SMS app -->
  <!-- Do NOT include MANAGE_EXTERNAL_STORAGE unless absolutely needed -->
</manifest>
```

**React Native Runtime Permission (Android)** – ask with user rationale (example):
```jsx
import { PermissionsAndroid } from 'react-native';

async function requestLocation() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs location access to provide location-based AI responses.",
        buttonPositive: "Allow",
        buttonNegative: "Deny",
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission denied");
      // Handle lack of permission (e.g. disable location features)
    }
  } catch (err) {
    console.warn(err);
  }
}
```

**Privacy Policy Outline** (sample points): 
- *Data Collected:* “This app collects voice inputs and chat history to provide AI responses, and location data for relevant results.”  
- *Usage:* “Collected data is used only for app functionality (e.g. processing queries on our servers) and is never sold.”  
- *Sharing:* “No personal data is shared with third parties, except for trusted analytics (Google Analytics) which collects anonymized usage stats.”  
- *User Rights:* “Users can request data deletion or opt-out by emailing us at support@example.com.”  

Customize and elaborate based on your actual data practices. Providing an in-app link to this policy (or a summary with a button to the full policy) helps transparency.  

## References  
- Google Play Developer Policies and Help Center (e.g. Developer Program Policies, User Data, Permissions)【4†L64-L71】【5†L43-L51】【6†L51-L59】  
- Play Console Help: Target SDK requirements【1†L37-L45】, Android photo/video permission policy【27†L74-L83】, All files access policy【14†L43-L46】, Metadata rules【34†L36-L44】.  
- React Native docs on Android publishing【8†L76-L84】.  
- Community and case studies (Adalo, blogs) on common rejection fixes【33†L95-L103】【33†L119-L121】. 

By systematically following these guidelines—disclosing and protecting user data, requesting only necessary permissions, and ensuring the app’s content and metadata comply—you can minimize the risk of Google Play rejection. 

