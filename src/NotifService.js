import moment from 'moment';
import PushNotification, { Importance } from 'react-native-push-notification';
import NotificationHandler from './NotificationHandler';
import theme from 'common/theme';
import { Platform } from 'react-native';

export default class NotifService {
  constructor(onRegister, onNotification) {
    this.lastId = 0;
    this.lastChannelCounter = 0;

    this.createDefaultChannels();

    NotificationHandler.attachRegister(onRegister);
    NotificationHandler.attachNotification(onNotification);

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });

    PushNotification.getChannels(function (channels) {
      console.log(channels);
    });
  }

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: 'Default channel', // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: 'sound-channel-id', // (required)
        channelName: 'Sound channel', // (required)
        channelDescription: 'A sound channel', // (optional) default: undefined.
        soundName: 'sample.mp3', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  createOrUpdateChannel() {
    this.lastChannelCounter++;
    PushNotification.createChannel(
      {
        channelId: 'custom-channel-id', // (required)
        channelName: `Custom channel - Counter: ${this.lastChannelCounter}`, // (required)
        channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  popInitialNotification() {
    PushNotification.popInitialNotification((notification) =>
      console.log('InitialNotication:', notification)
    );
  }

  scheduleNotif(program, soundName) {
    this.lastId++;
    const { title, description, time } = program;
    const datetime = new Date(time);
    const beforeTime = moment(datetime).subtract(5, 'minutes');

    let configuration = {
      date: new Date(beforeTime), // should be the time of the program minus 5 minutes
      // date: new Date(Date.now() + 30 * 1000), // in 30 secs

      /* Android Only Properties */
      channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      // largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      // smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: description || 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
      subText: title || 'This is a subText', // (optional) default: none
      color: theme.iplayya.colors.vibrantpussy, // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: 'group', // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      // actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
      // invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      // repeatType: 'minute',
      // repeatTime: 10,

      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      /* iOS only properties */
      category: '', // (optional) default: empty string
      subtitle: title || 'My Notification Subtitle',

      /* iOS and Android properties */
      // id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      id: program.id || this.lastId,
      title: program.channelName || 'Scheduled Notification', // (optional)
      message: description || 'My Notification Message', // (required)
      // userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
      userInfo: { id: program.id, ...program },
      playSound: !!soundName, // (optional) default: true
      soundName: soundName ? soundName : 'default' // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    };

    /// CREATE A SCHEDULED NOTIFICATION 5 MINS BEFORE THE PROGRAM STARTS
    PushNotification.localNotificationSchedule(configuration);

    if (Platform.OS === 'android') {
      configuration = Object.assign(configuration, { date: datetime, id: this.lastId });

      PushNotification.localNotificationSchedule(configuration);

      return;
    }

    /// for IOS start time
    /// CREATE ANOTHER SCHEDULED NOTIFICATION AT THE EXACT START TIME OF THE PROGRAM
    // configuration = Object.assign(configuration, { id: this.lastId, date: datetime });
    PushNotification.localNotificationSchedule({
      // date: new Date(beforeTime), // should be the time of the program minus 5 minutes
      date: datetime,

      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      /* iOS only properties */
      category: '', // (optional) default: empty string
      subtitle: title || 'My Notification Subtitle',

      /* iOS and Android properties */
      // id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      id: `${program.id}_start`,
      title: program.channelName || 'Scheduled Notification', // (optional)
      message: description || 'My Notification Message', // (required)
      // userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
      userInfo: { id: program.id, ...program },
      playSound: !!soundName, // (optional) default: true
      soundName: soundName ? soundName : 'default' // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  requestPermissions() {
    return PushNotification.requestPermissions();
  }

  cancelNotif(id) {
    /// delete before time
    PushNotification.cancelLocalNotifications({ id });

    /// delete start time for android
    if (Platform.OS === 'android') {
      this.lastId++;
      PushNotification.cancelLocalNotifications({ id: this.lastId });

      return;
    }

    /// delete start time for IOS
    PushNotification.cancelLocalNotifications({ id: `${id}_start` });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  abandonPermissions() {
    PushNotification.abandonPermissions();
  }

  getScheduledLocalNotifications(callback) {
    PushNotification.getScheduledLocalNotifications(callback);
  }

  getDeliveredNotifications(callback) {
    PushNotification.getDeliveredNotifications(callback);
  }

  removeDeliveredNotifs(ids) {
    console.log('deleting notifs, ', ids);
    PushNotification.removeDeliveredNotifications(ids);
  }
}
