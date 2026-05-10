import { PrismaClient, ActivityType } from "@prisma/client";

const db = new PrismaClient();

const citiesData = [
  { name: "Tokyo", country: "Japan", region: "Asia", costIndex: 75, popularityScore: 95, description: "A dazzling blend of ultramodern neon-lit skyscrapers and traditional temples.", coverImageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80" },
  { name: "Paris", country: "France", region: "Europe", costIndex: 80, popularityScore: 98, description: "The City of Light — art, fashion, gastronomy, and culture at every corner.", coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80" },
  { name: "New York", country: "USA", region: "North America", costIndex: 90, popularityScore: 99, description: "The city that never sleeps — iconic skyline, Broadway, and world-class dining.", coverImageUrl: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1200&q=80" },
  { name: "London", country: "UK", region: "Europe", costIndex: 85, popularityScore: 96, description: "Historic landmarks meet modern innovation on the banks of the Thames.", coverImageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80" },
  { name: "Rome", country: "Italy", region: "Europe", costIndex: 65, popularityScore: 94, description: "The Eternal City — ancient ruins, Renaissance art, and incredible pasta.", coverImageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80" },
  { name: "Barcelona", country: "Spain", region: "Europe", costIndex: 60, popularityScore: 92, description: "Gaudi's masterpieces, Mediterranean beaches, and vibrant nightlife.", coverImageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80" },
  { name: "Dubai", country: "UAE", region: "Middle East", costIndex: 85, popularityScore: 90, description: "Futuristic architecture, luxury shopping, and desert adventures.", coverImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80" },
  { name: "Singapore", country: "Singapore", region: "Asia", costIndex: 82, popularityScore: 91, description: "A garden city where futuristic design meets rich cultural heritage.", coverImageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80" },
  { name: "Bangkok", country: "Thailand", region: "Asia", costIndex: 35, popularityScore: 93, description: "Street food paradise, ornate temples, and bustling floating markets.", coverImageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80" },
  { name: "Istanbul", country: "Turkey", region: "Europe", costIndex: 45, popularityScore: 89, description: "Where East meets West — Byzantine and Ottoman wonders along the Bosphorus.", coverImageUrl: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&q=80" },
  { name: "Hong Kong", country: "China", region: "Asia", costIndex: 78, popularityScore: 88, description: "Towering skyline, dim sum, and a harbor that sparkles at night.", coverImageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=80" },
  { name: "Sydney", country: "Australia", region: "Oceania", costIndex: 80, popularityScore: 90, description: "Harbor Bridge, Opera House, and sun-drenched coastal living.", coverImageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80" },
  { name: "Amsterdam", country: "Netherlands", region: "Europe", costIndex: 72, popularityScore: 91, description: "Canals, cycling culture, and world-class museums in a compact city.", coverImageUrl: "https://images.unsplash.com/photo-1558618666-f975f85cd64?w=1200&q=80" },
  { name: "Berlin", country: "Germany", region: "Europe", costIndex: 60, popularityScore: 88, description: "History, avant-garde art, and a nightlife scene like no other.", coverImageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80" },
  { name: "Prague", country: "Czech Republic", region: "Europe", costIndex: 40, popularityScore: 87, description: "The City of a Hundred Spires — fairytale architecture and cheap beer.", coverImageUrl: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80" },
  { name: "Lisbon", country: "Portugal", region: "Europe", costIndex: 45, popularityScore: 86, description: "Hilly streets, vintage trams, pastel de nata, and Atlantic sunsets.", coverImageUrl: "https://images.unsplash.com/photo-1585208798174-6ced3a5e0155?w=1200&q=80" },
  { name: "Kyoto", country: "Japan", region: "Asia", costIndex: 60, popularityScore: 89, description: "Ancient temples, geisha districts, and serene bamboo forests.", coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80" },
  { name: "Seoul", country: "South Korea", region: "Asia", costIndex: 55, popularityScore: 87, description: "K-pop, K-beauty, palaces, and some of the world's best street food.", coverImageUrl: "https://images.unsplash.com/photo-1538485399083-8bfa8c5b2a8e?w=1200&q=80" },
  { name: "Mexico City", country: "Mexico", region: "North America", costIndex: 30, popularityScore: 85, description: "Aztec ruins, Frida Kahlo's legacy, and unbeatable tacos al pastor.", coverImageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80" },
  { name: "Marrakech", country: "Morocco", region: "Africa", costIndex: 25, popularityScore: 84, description: "Medina maze, riads, spice souks, and the magic of the Sahara's edge.", coverImageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80" },
  { name: "Vienna", country: "Austria", region: "Europe", costIndex: 65, popularityScore: 85, description: "Imperial palaces, coffee house culture, and the music of Mozart.", coverImageUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80" },
  { name: "Buenos Aires", country: "Argentina", region: "South America", costIndex: 35, popularityScore: 83, description: "Tango, steak, and European-style boulevards in Latin America.", coverImageUrl: "https://images.unsplash.com/photo-1589909202802-8f4aadce2e5d?w=1200&q=80" },
  { name: "Cape Town", country: "South Africa", region: "Africa", costIndex: 40, popularityScore: 86, description: "Table Mountain, penguins, wine country, and dramatic coastlines.", coverImageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80" },
  { name: "San Francisco", country: "USA", region: "North America", costIndex: 88, popularityScore: 89, description: "Golden Gate Bridge, tech innovation, and hilly Victorian charm.", coverImageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80" },
  { name: "Rio de Janeiro", country: "Brazil", region: "South America", costIndex: 38, popularityScore: 88, description: "Christ the Redeemer, Copacabana, samba, and carnival energy.", coverImageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80" },
  { name: "Edinburgh", country: "Scotland", region: "Europe", costIndex: 55, popularityScore: 82, description: "A medieval old town, castle on a crag, and the world's largest arts festival.", coverImageUrl: "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=1200&q=80" },
  { name: "Dubrovnik", country: "Croatia", region: "Europe", costIndex: 50, popularityScore: 81, description: "King's Landing — fortified walls, sapphire Adriatic, and seafood.", coverImageUrl: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=1200&q=80" },
  { name: "Mumbai", country: "India", region: "Asia", costIndex: 25, popularityScore: 85, description: "Bollywood, colonial architecture, and the chaos of India's financial capital.", coverImageUrl: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200&q=80" },
  { name: "Petra", country: "Jordan", region: "Middle East", costIndex: 30, popularityScore: 80, description: "The rose-red city half as old as time — carved into desert cliffs.", coverImageUrl: "https://images.unsplash.com/photo-1579606038863-6b4d2f8b9f5e?w=1200&q=80" },
  { name: "Reykjavik", country: "Iceland", region: "Europe", costIndex: 95, popularityScore: 84, description: "Gateway to the Northern Lights, geysers, and otherworldly landscapes.", coverImageUrl: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&q=80" },
  { name: "Machu Picchu", country: "Peru", region: "South America", costIndex: 28, popularityScore: 92, description: "The lost Incan citadel perched high in the Andes.", coverImageUrl: "https://images.unsplash.com/photo-1526392060635-9b3b0f6b2e5e?w=1200&q=80" },
  { name: "Santorini", country: "Greece", region: "Europe", costIndex: 70, popularityScore: 91, description: "White-washed cliffs, blue domes, and the most photographed sunset on Earth.", coverImageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80" },
  { name: "Bali", country: "Indonesia", region: "Asia", costIndex: 20, popularityScore: 90, description: "Rice terraces, surf breaks, yoga retreats, and spiritual temples.", coverImageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80" },
  { name: "Cairo", country: "Egypt", region: "Africa", costIndex: 20, popularityScore: 87, description: "The Great Pyramids, the Nile, and millennia of history.", coverImageUrl: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80" },
  { name: "Hanoi", country: "Vietnam", region: "Asia", costIndex: 18, popularityScore: 84, description: "French colonial charm, Old Quarter chaos, and the best pho in the world.", coverImageUrl: "https://images.unsplash.com/photo-1528127220108-612460f747f9?w=1200&q=80" },
  { name: "Zurich", country: "Switzerland", region: "Europe", costIndex: 95, popularityScore: 78, description: "Pristine lake, Swiss precision, and fondue by candlelight.", coverImageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&q=80" },
  { name: "Stockholm", country: "Sweden", region: "Europe", costIndex: 80, popularityScore: 80, description: "Archipelago islands, Nordic design, and midsummer magic.", coverImageUrl: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1200&q=80" },
  { name: "Kuala Lumpur", country: "Malaysia", region: "Asia", costIndex: 30, popularityScore: 83, description: "Petronas Towers, hawker stalls, and a melting pot of cultures.", coverImageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80" },
  { name: "Milan", country: "Italy", region: "Europe", costIndex: 70, popularityScore: 84, description: "Fashion capital, Duomo di Milano, and aperitivo culture.", coverImageUrl: "https://images.unsplash.com/photo-1512232058649-001cc302955d?w=1200&q=80" },
  { name: "Osaka", country: "Japan", region: "Asia", costIndex: 55, popularityScore: 82, description: "Japan's kitchen — takoyaki, okonomiyaki, and neon-lit Dotonbori.", coverImageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1200&q=80" },
  { name: "Cartagena", country: "Colombia", region: "South America", costIndex: 25, popularityScore: 79, description: "Colorful colonial walls, Caribbean breeze, and ceviche.", coverImageUrl: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=1200&q=80" },
  { name: "Queenstown", country: "New Zealand", region: "Oceania", costIndex: 70, popularityScore: 85, description: "Adventure capital of the world — bungee, fjords, and Pinot Noir.", coverImageUrl: "https://images.unsplash.com/photo-1507699784602-9b3b0f6b2e5e?w=1200&q=80" },
  { name: "Venice", country: "Italy", region: "Europe", costIndex: 75, popularityScore: 90, description: "Canals, gondolas, and Byzantine grandeur slowly sinking into the lagoon.", coverImageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&q=80" },
  { name: "Krakow", country: "Poland", region: "Europe", costIndex: 30, popularityScore: 78, description: "A medieval market square, castles, and the salt mines of Wieliczka.", coverImageUrl: "https://images.unsplash.com/photo-1606992894450-4d6f5c5f6f9e?w=1200&q=80" },
  { name: "Jaipur", country: "India", region: "Asia", costIndex: 18, popularityScore: 80, description: "The Pink City — palaces, forts, and block-print textiles.", coverImageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80" },
  { name: "Auckland", country: "New Zealand", region: "Oceania", costIndex: 65, popularityScore: 76, description: "Volcanic cones, Maori heritage, and the gateway to Middle-earth.", coverImageUrl: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80" },
  { name: "Taipei", country: "Taiwan", region: "Asia", costIndex: 35, popularityScore: 81, description: "Night markets, hot springs, and Taipei 101 piercing the clouds.", coverImageUrl: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1200&q=80" },
  { name: "Athens", country: "Greece", region: "Europe", costIndex: 45, popularityScore: 86, description: "The cradle of Western civilization — Acropolis, ouzo, and olive groves.", coverImageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=80" },
  { name: "Florence", country: "Italy", region: "Europe", costIndex: 60, popularityScore: 91, description: "Renaissance birthplace, Uffizi Gallery, and the best gelato in Italy.", coverImageUrl: "https://images.unsplash.com/photo-1528114039593-43664da1e704?w=1200&q=80" },
  { name: "Havana", country: "Cuba", region: "North America", costIndex: 15, popularityScore: 77, description: "Crumbling Art Deco, vintage cars, salsa, and rum on the Malecon.", coverImageUrl: "https://images.unsplash.com/photo-1503197979108-c824168d51a8?w=1200&q=80" },
  { name: "Chiang Mai", country: "Thailand", region: "Asia", costIndex: 15, popularityScore: 82, description: "Temple-dotted old city, elephant sanctuaries, and mountain treks.", coverImageUrl: "https://images.unsplash.com/photo-1598935898639-33d885d54861?w=1200&q=80" },
  { name: "Tallinn", country: "Estonia", region: "Europe", costIndex: 40, popularityScore: 72, description: "A perfectly preserved medieval old town with a booming tech scene.", coverImageUrl: "https://images.unsplash.com/photo-1564659907535-1b3a3f6b2e5e?w=1200&q=80" },
  { name: "Moscow", country: "Russia", region: "Europe", costIndex: 45, popularityScore: 75, description: "Red Square, onion domes, and the Bolshoi ballet.", coverImageUrl: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80" },
  { name: "Dublin", country: "Ireland", region: "Europe", costIndex: 70, popularityScore: 83, description: "Literary pubs, Georgian doors, and the warmth of Irish storytelling.", coverImageUrl: "https://images.unsplash.com/photo-1580118869283-654855b23f5c?w=1200&q=80" },
  { name: "Lima", country: "Peru", region: "South America", costIndex: 30, popularityScore: 80, description: "Ceviche capital, pre-Columbian history, and Pacific cliffside dining.", coverImageUrl: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&q=80" },
  { name: "Seville", country: "Spain", region: "Europe", costIndex: 45, popularityScore: 84, description: "Flamenco, orange-blossomed plazas, and Moorish alcazars.", coverImageUrl: "https://images.unsplash.com/photo-1551189014-fe516aed0e9e?w=1200&q=80" },
  { name: "Phuket", country: "Thailand", region: "Asia", costIndex: 25, popularityScore: 86, description: "Powder beaches, limestone karsts, and legendary island nightlife.", coverImageUrl: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80" },
  { name: "Munich", country: "Germany", region: "Europe", costIndex: 70, popularityScore: 83, description: "Oktoberfest, baroque churches, and beer gardens under chestnut trees.", coverImageUrl: "https://images.unsplash.com/photo-1595867865354-20a3e122086e?w=1200&q=80" },
  { name: "Ljubljana", country: "Slovenia", region: "Europe", costIndex: 35, popularityScore: 70, description: "A fairy-tale capital of dragons, bridges, and alpine proximity.", coverImageUrl: "https://images.unsplash.com/photo-1564550873274-6e9d1b5b3b0e?w=1200&q=80" },
  { name: "Ho Chi Minh City", country: "Vietnam", region: "Asia", costIndex: 18, popularityScore: 81, description: "Motorbike chaos, French baguettes, and wartime tunnels.", coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a8bc7d565fc?w=1200&q=80" },
  { name: "Tbilisi", country: "Georgia", region: "Europe", costIndex: 20, popularityScore: 73, description: "Sulfur baths, Art Nouveau facades, and the birthplace of wine.", coverImageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea3ea?w=1200&q=80" },
  { name: "Toronto", country: "Canada", region: "North America", costIndex: 75, popularityScore: 82, description: "Multicultural neighborhoods, the CN Tower, and world-class cuisine.", coverImageUrl: "https://images.unsplash.com/photo-1507992781-9f65f89f96ef?w=1200&q=80" },
  { name: "Nairobi", country: "Kenya", region: "Africa", costIndex: 22, popularityScore: 74, description: "Urban safari — national park within city limits, Maasai markets, and coffee.", coverImageUrl: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1200&q=80" },
];

function getActivityImageUrl(type: ActivityType): string {
  const urls: Record<ActivityType, string> = {
    sightseeing: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    culture: "https://images.unsplash.com/photo-1564399579883-451a5d44ec7d?w=800&q=80",
    food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    adventure: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&q=80",
    other: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  };
  return urls[type];
}

function getActivities(cityName: string): Array<{
  name: string;
  description: string;
  type: ActivityType;
  estimatedCost: number;
  durationMinutes: number;
  imageUrl: string;
}> {
  const templates: Record<string, Array<[string, string, ActivityType, number, number]>> = {
    Tokyo: [
      ["Senso-ji Temple Visit", "Explore Tokyo's oldest Buddhist temple in Asakusa.", "culture", 0, 120],
      ["Shibuya Crossing Walk", "Experience the world's busiest pedestrian crossing.", "sightseeing", 0, 30],
      ["Sushi Omakase Dinner", "Trust the chef with a curated multi-course sushi meal.", "food", 80, 120],
      ["Akihabara Electronics Crawl", "Browse anime, games, and gadgets in Electric Town.", "shopping", 50, 180],
      ["Tokyo Skytree Observation", "Panoramic city views from 634 meters up.", "sightseeing", 25, 90],
      ["Tsukiji Outer Market Tour", "Sample fresh seafood, tamago, and wagashi.", "food", 30, 120],
      ["Meiji Shrine Walk", "Peaceful forest shrine dedicated to Emperor Meiji.", "culture", 0, 90],
      ["Robot Restaurant Show", "Neon, robots, lasers — quintessential Tokyo spectacle.", "adventure", 60, 90],
      ["Harajuku Fashion Walk", "Explore Takeshita Street and omotesando boutiques.", "shopping", 40, 120],
      ["Sumo Wrestling Tournament", "Watch grand champions clash at Ryogoku Kokugikan.", "culture", 45, 180],
      ["Onsen Bath Experience", "Relax in a traditional hot spring bathhouse.", "adventure", 25, 120],
      ["Ramen District Hop", "Taste tonkotsu, miso, and shoyu ramen across the city.", "food", 20, 90],
      ["Cherry Blossom Park Picnic", "Hanami under pink sakura canopies in Ueno Park.", "sightseeing", 15, 180],
      ["Ghibli Museum Visit", "Step inside the world of Miyazaki's animation.", "culture", 15, 150],
    ],
    Paris: [
      ["Louvre Museum Tour", "Mona Lisa, Winged Victory, and millennia of art.", "culture", 20, 180],
      ["Eiffel Tower Sunset", "Watch the city glow as lights flicker on the tower.", "sightseeing", 30, 120],
      ["Seine River Cruise", "Glide past Notre-Dame, the Louvre, and Musée d'Orsay.", "sightseeing", 18, 90],
      ["Le Marais Food Walk", "Falafel, macarons, and Jewish bakeries in a historic district.", "food", 35, 150],
      ["Montmartre Art Stroll", "Sacré-Cœur, street artists, and Parisian bohemia.", "culture", 0, 120],
      ["Versailles Day Trip", "Hall of Mirrors and the Sun King's gardens.", "culture", 22, 360],
      ["Bistro Dinner", "Steak frites and wine in a classic neighborhood bistro.", "food", 45, 120],
      ["Champs-Élysées Shopping", "Luxury boutiques from Louis Vuitton to Cartier.", "shopping", 100, 120],
      ["Catacombs Exploration", "Walk the underground ossuaries holding six million souls.", "adventure", 15, 90],
      ["Opera Garnier Performance", "Ballet or opera in a Beaux-Arts masterpiece.", "culture", 60, 150],
      ["Père Lachaise Cemetery", "Pay respects to Jim Morrison, Oscar Wilde, and Édith Piaf.", "sightseeing", 0, 90],
      ["Wine Tasting in Saint-Germain", "Sample Bordeaux, Burgundy, and Champagne.", "food", 55, 120],
      ["Bike Tour Along the Canal", "Pedal the Canal Saint-Martin like a local.", "adventure", 25, 120],
    ],
  };

  const cityKey = Object.keys(templates).find((k) => cityName.includes(k));
  if (cityKey) {
    return templates[cityKey].map(([name, description, type, cost, duration]) => ({
      name,
      description,
      type,
      estimatedCost: cost,
      durationMinutes: duration,
      imageUrl: getActivityImageUrl(type),
    }));
  }

  // Fallback generic activities for any city
  return [
    { name: `Walking Tour of ${cityName}`, description: "Explore the historic center with a local guide.", type: "sightseeing", estimatedCost: 0, durationMinutes: 120, imageUrl: getActivityImageUrl("sightseeing") },
    { name: `Local Market Visit`, description: "Browse fresh produce, spices, and artisan goods.", type: "food", estimatedCost: 15, durationMinutes: 90, imageUrl: getActivityImageUrl("food") },
    { name: `Museum Pass Day`, description: "Visit the top museums and galleries in the city.", type: "culture", estimatedCost: 25, durationMinutes: 240, imageUrl: getActivityImageUrl("culture") },
    { name: `Sunset Viewpoint Hike`, description: "Climb to the best panoramic viewpoint at golden hour.", type: "adventure", estimatedCost: 0, durationMinutes: 120, imageUrl: getActivityImageUrl("adventure") },
    { name: `Cooking Class`, description: "Learn to prepare a traditional local dish hands-on.", type: "food", estimatedCost: 45, durationMinutes: 180, imageUrl: getActivityImageUrl("food") },
    { name: `Neighborhood Coffee Crawl`, description: "Hop between the city's best independent cafés.", type: "food", estimatedCost: 20, durationMinutes: 120, imageUrl: getActivityImageUrl("food") },
    { name: `Street Art Walking Route`, description: "Discover murals, graffiti, and urban art installations.", type: "culture", estimatedCost: 0, durationMinutes: 90, imageUrl: getActivityImageUrl("culture") },
    { name: `Historic Quarter Exploration`, description: "Wander cobblestone streets and admire ancient architecture.", type: "sightseeing", estimatedCost: 0, durationMinutes: 150, imageUrl: getActivityImageUrl("sightseeing") },
    { name: `Local Craft Workshop`, description: "Make pottery, textiles, or jewelry with local artisans.", type: "culture", estimatedCost: 35, durationMinutes: 150, imageUrl: getActivityImageUrl("culture") },
    { name: `Rooftop Bar Evening`, description: "Sip cocktails with panoramic city views after dark.", type: "food", estimatedCost: 40, durationMinutes: 120, imageUrl: getActivityImageUrl("food") },
    { name: `Bike Rental & City Loop`, description: "Pedal through parks, riversides, and hidden alleys.", type: "adventure", estimatedCost: 15, durationMinutes: 180, imageUrl: getActivityImageUrl("adventure") },
    { name: `Traditional Dance Show`, description: "Experience live folk or contemporary performance.", type: "culture", estimatedCost: 30, durationMinutes: 120, imageUrl: getActivityImageUrl("culture") },
    { name: `Souvenir Shopping District`, description: "Browse local crafts, textiles, and unique gifts.", type: "shopping", estimatedCost: 50, durationMinutes: 120, imageUrl: getActivityImageUrl("shopping") },
    { name: `Local Park Picnic`, description: "Relax in the city's most beautiful green space.", type: "sightseeing", estimatedCost: 10, durationMinutes: 120, imageUrl: getActivityImageUrl("sightseeing") },
    { name: `Night Photography Walk`, description: "Capture illuminated landmarks and neon streets.", type: "adventure", estimatedCost: 0, durationMinutes: 120, imageUrl: getActivityImageUrl("adventure") },
  ];
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await db.savedDestination.deleteMany();
  await db.tripNote.deleteMany();
  await db.checklistItem.deleteMany();
  await db.tripExpense.deleteMany();
  await db.stopActivity.deleteMany();
  await db.activity.deleteMany();
  await db.stop.deleteMany();
  await db.trip.deleteMany();
  await db.city.deleteMany();
  await db.userProfile.deleteMany();

  console.log(`Creating ${citiesData.length} cities...`);

  for (const cityData of citiesData) {
    const city = await db.city.create({
      data: {
        ...cityData,
        costIndex: cityData.costIndex,
        popularityScore: cityData.popularityScore,
      },
    });

    const activities = getActivities(cityData.name);
    for (const activity of activities) {
      await db.activity.create({
        data: {
          ...activity,
          cityId: city.id,
        },
      });
    }

    console.log(`  ${city.name}: ${activities.length} activities`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
