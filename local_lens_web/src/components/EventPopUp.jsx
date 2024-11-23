import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase-config';

function EventPopup({ isOpen, onClose, user }) {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventLocation, setEventLocation] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const docRef = await addDoc(collection(db, "events"), {
        id: generateRandomId(),
        name: eventName,
        uid: user.uid,
        date: new Date(eventDate + 'T' + eventTime),
        location: eventLocation,
        time: eventTime,
      });
      console.log('Event submitted:', { eventName, eventDate, eventTime, eventLocation });
      onClose();
    };

    function generateRandomId() {
      return "ev-" + Math.random().toString(36).substr(2, 9);
    }
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Post an Event</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Event Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mb-4">
              Post Event
            </button>
          </form>
          <button onClick={onClose} className="w-full bg-gray-300 text-gray-700 p-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  export default EventPopup;