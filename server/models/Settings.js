import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      default: 'New Pittam Deurali Guest House & Restaurant',
    },
    address: {
      type: String,
      default: 'Pittam Deurali, Lumle 33700, Kaski, Nepal',
    },
    phone: {
      type: String,
      default: '+977-9801234567',
    },
    email: {
      type: String,
      default: 'info@newpittamdeurali.com',
    },
    whatsappNumber: {
      type: String,
      default: '9779801234567', // Pre-filled without '+' or spaces for API URL trigger compatibility
    },
    googleMapIframe: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3512.522204907997!2d83.82256137530612!3d28.330925975829672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995ebdc4ec5418b%3A0xe54e60ef2b1c6096!2sPitam%20Deurali!5e0!3m2!1sen!2snp!4v1717200000000!5m2!1sen!2snp',
    },
    facebookUrl: {
      type: String,
      default: 'https://facebook.com/newpittamdeurali',
    },
    instagramUrl: {
      type: String,
      default: 'https://instagram.com/newpittamdeurali',
    },
    tripAdvisorUrl: {
      type: String,
      default: 'https://tripadvisor.com',
    },
    showPricesPublicly: {
      type: Boolean,
      default: false,
    },
    enableDiscounts: {
      type: Boolean,
      default: false,
    },
    highlightDiscountedItems: {
      type: Boolean,
      default: false,
    },
    showContactForPriceInstead: {
      type: Boolean,
      default: true,
    },
    showRoomPricesPublicly: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

SettingsSchema.pre('save', function(next) {
  if (this.isModified('phone')) {
    this.whatsappNumber = this.phone.replace(/[+\s\-()]/g, '');
  }
  next();
});

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;
