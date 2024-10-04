import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faTimes} from '@fortawesome/free-solid-svg-icons'; // Import the close (times) icon
import { faCalendar as faRegularCalendar } from '@fortawesome/free-regular-svg-icons'; // Regular calendar icon
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(faUser, faEnvelope, faPhone, faMapMarkerAlt, faRegularCalendar, faTimes, faPenToSquare,faEye,faPlus);


const app = createApp(App);
app.use(router);
app.use(bootstrap);

// Register FontAwesomeIcon globally
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
