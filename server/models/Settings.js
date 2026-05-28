import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      default: 'Sanctum Retreat Pokhara',
    },
    address: {
      type: String,
      default: 'Lakeside Road, Ward 6, Pokhara, Nepal',
    },
    phone: {
      type: String,
      default: '+977-61-460000',
    },
    email: {
      type: String,
      default: 'info@sanctumpokhara.com',
    },
    whatsappNumber: {
      type: String,
      default: '9779800000000', // Pre-filled without '+' or spaces for API URL trigger compatibility
    },
    googleMapIframe: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56214.99648937984!2d83.92989126300407!3d28.2107872658826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995937bbf0347fd%3A0x8a23072ab83b4b8a!2sPokhara!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp',
    },
    facebookUrl: {
      type: String,
      default: 'https://facebook.com/sanctumpokhara',
    },
    instagramUrl: {
      type: String,
      default: 'https://instagram.com/sanctumpokhara',
    },
    tripAdvisorUrl: {
      type: String,
      default: 'https://tripadvisor.com',
    }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;
