# Go Find Taxi 🚕

A Flutter-based mobile application designed to help Ethiopian commuters easily locate and navigate traditional bus taxi routes.

## Problem Statement 🎯

In Ethiopia, affordable public transportation options, such as traditional bus taxis, play a vital role in daily commuting. However, locating these taxis, particularly for less familiar routes, can be challenging due to:

- Lack of centralized information
- No real-time updates on taxi locations
- Difficulty finding correct pick-up points
- Limited knowledge of routes for unfamiliar destinations
- Time wasted waiting at incorrect stops

GoFindTaxi seeks to address these issues by offering a user-friendly platform that enables commuters to locate traditional bus taxis in real-time, access detailed information about popular routes, and receive personalized recommendations.

## Features ✨

- **Location Search**: Search for any location and find nearby taxi stations
- **Route Planning**: Get optimal routes between your location and Taxi Place
- **Price Estimation**: View estimated taxi fares for your journey
## GebetaMaps API Integration 🗺️

The project utilizes GebetaMaps API for the following services:

### Direction Service
- Calculates optimal public transport routes
- Identifies traditional taxi routes between locations
- Provides estimated travel times

### Geocoding Service
- Converts location names to coordinates
- Enables search functionality for destinations
- Identifies nearby landmarks for pick-up points

### Reverse Geocoding
- Converts coordinates to readable addresses
- Helps identify current location context
- Provides landmark references for users

## Getting Started 🚀

### Prerequisites
- Flutter SDK (^3.5.1)
- GebetaMaps API key
- Git

### Installation

1. Clone the repository

2. Create a `.env` file in the root directory:
```
GEBETA_MAPS_API_KEY=your_api_key_here
```

3. Install dependencies
```bash
flutter pub get
```

4. Run the app
```bash
flutter run
```

## Required Permissions 📱

- Location access
- Internet connectivity
- Background location updates

## Future Enhancements 🔮

1. **Real-time Taxi Tracking**
   - Live updates of taxi locations
   - Estimated arrival times

2. **Community Features**
   - User-contributed route information
   - Route ratings and reviews
   - Traffic updates

3. **Enhanced Navigation**
   - Turn-by-turn walking directions to pick-up points
   - Alternative route suggestions
   - Peak hours information

4. **Accessibility Features**
   - Voice guidance
   - High contrast mode
   - Screen reader optimization

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.



## Acknowledgments 🙏

- GebetaMaps for providing the mapping API 

## Contact 📧

For any queries or suggestions, please open an issue in the repository.

---
Made with ❤️ for Ethiopian commuters
