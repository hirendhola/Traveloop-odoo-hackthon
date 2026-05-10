import { PrismaClient, ActivityType } from "@prisma/client";

const db = new PrismaClient();

const citiesData = [
  { name: "Tokyo", country: "Japan", region: "Asia", costIndex: 75, popularityScore: 95, description: "A dazzling blend of ultramodern neon-lit skyscrapers and traditional temples." },
  { name: "Paris", country: "France", region: "Europe", costIndex: 80, popularityScore: 98, description: "The City of Light — art, fashion, gastronomy, and culture at every corner." },
  { name: "New York", country: "USA", region: "North America", costIndex: 90, popularityScore: 99, description: "The city that never sleeps — iconic skyline, Broadway, and world-class dining." },
  { name: "London", country: "UK", region: "Europe", costIndex: 85, popularityScore: 96, description: "Historic landmarks meet modern innovation on the banks of the Thames." },
  { name: "Rome", country: "Italy", region: "Europe", costIndex: 65, popularityScore: 94, description: "The Eternal City — ancient ruins, Renaissance art, and incredible pasta." },
  { name: "Barcelona", country: "Spain", region: "Europe", costIndex: 60, popularityScore: 92, description: "Gaudi's masterpieces, Mediterranean beaches, and vibrant nightlife." },
  { name: "Dubai", country: "UAE", region: "Middle East", costIndex: 85, popularityScore: 90, description: "Futuristic architecture, luxury shopping, and desert adventures." },
  { name: "Singapore", country: "Singapore", region: "Asia", costIndex: 82, popularityScore: 91, description: "A garden city where futuristic design meets rich cultural heritage." },
  { name: "Bangkok", country: "Thailand", region: "Asia", costIndex: 35, popularityScore: 93, description: "Street food paradise, ornate temples, and bustling floating markets." },
  { name: "Istanbul", country: "Turkey", region: "Europe", costIndex: 45, popularityScore: 89, description: "Where East meets West — Byzantine and Ottoman wonders along the Bosphorus." },
  { name: "Hong Kong", country: "China", region: "Asia", costIndex: 78, popularityScore: 88, description: "Towering skyline, dim sum, and a harbor that sparkles at night." },
  { name: "Sydney", country: "Australia", region: "Oceania", costIndex: 80, popularityScore: 90, description: "Harbor Bridge, Opera House, and sun-drenched coastal living." },
  { name: "Amsterdam", country: "Netherlands", region: "Europe", costIndex: 72, popularityScore: 91, description: "Canals, cycling culture, and world-class museums in a compact city." },
  { name: "Berlin", country: "Germany", region: "Europe", costIndex: 60, popularityScore: 88, description: "History, avant-garde art, and a nightlife scene like no other." },
  { name: "Prague", country: "Czech Republic", region: "Europe", costIndex: 40, popularityScore: 87, description: "The City of a Hundred Spires — fairytale architecture and cheap beer." },
  { name: "Lisbon", country: "Portugal", region: "Europe", costIndex: 45, popularityScore: 86, description: "Hilly streets, vintage trams, pastel de nata, and Atlantic sunsets." },
  { name: "Kyoto", country: "Japan", region: "Asia", costIndex: 60, popularityScore: 89, description: "Ancient temples, geisha districts, and serene bamboo forests." },
  { name: "Seoul", country: "South Korea", region: "Asia", costIndex: 55, popularityScore: 87, description: "K-pop, K-beauty, palaces, and some of the world's best street food." },
  { name: "Mexico City", country: "Mexico", region: "North America", costIndex: 30, popularityScore: 85, description: "Aztec ruins, Frida Kahlo's legacy, and unbeatable tacos al pastor." },
  { name: "Marrakech", country: "Morocco", region: "Africa", costIndex: 25, popularityScore: 84, description: "Medina maze, riads, spice souks, and the magic of the Sahara's edge." },
  { name: "Vienna", country: "Austria", region: "Europe", costIndex: 65, popularityScore: 85, description: "Imperial palaces, coffee house culture, and the music of Mozart." },
  { name: "Buenos Aires", country: "Argentina", region: "South America", costIndex: 35, popularityScore: 83, description: "Tango, steak, and European-style boulevards in Latin America." },
  { name: "Cape Town", country: "South Africa", region: "Africa", costIndex: 40, popularityScore: 86, description: "Table Mountain, penguins, wine country, and dramatic coastlines." },
  { name: "San Francisco", country: "USA", region: "North America", costIndex: 88, popularityScore: 89, description: "Golden Gate Bridge, tech innovation, and hilly Victorian charm." },
  { name: "Rio de Janeiro", country: "Brazil", region: "South America", costIndex: 38, popularityScore: 88, description: "Christ the Redeemer, Copacabana, samba, and carnival energy." },
  { name: "Edinburgh", country: "Scotland", region: "Europe", costIndex: 55, popularityScore: 82, description: "A medieval old town, castle on a crag, and the world's largest arts festival." },
  { name: "Dubrovnik", country: "Croatia", region: "Europe", costIndex: 50, popularityScore: 81, description: "King's Landing — fortified walls, sapphire Adriatic, and seafood." },
  { name: "Mumbai", country: "India", region: "Asia", costIndex: 25, popularityScore: 85, description: "Bollywood, colonial architecture, and the chaos of India's financial capital." },
  { name: "Petra", country: "Jordan", region: "Middle East", costIndex: 30, popularityScore: 80, description: "The rose-red city half as old as time — carved into desert cliffs." },
  { name: "Reykjavik", country: "Iceland", region: "Europe", costIndex: 95, popularityScore: 84, description: "Gateway to the Northern Lights, geysers, and otherworldly landscapes." },
  { name: "Machu Picchu", country: "Peru", region: "South America", costIndex: 28, popularityScore: 92, description: "The lost Incan citadel perched high in the Andes." },
  { name: "Santorini", country: "Greece", region: "Europe", costIndex: 70, popularityScore: 91, description: "White-washed cliffs, blue domes, and the most photographed sunset on Earth." },
  { name: "Bali", country: "Indonesia", region: "Asia", costIndex: 20, popularityScore: 90, description: "Rice terraces, surf breaks, yoga retreats, and spiritual temples." },
  { name: "Cairo", country: "Egypt", region: "Africa", costIndex: 20, popularityScore: 87, description: "The Great Pyramids, the Nile, and millennia of history." },
  { name: "Hanoi", country: "Vietnam", region: "Asia", costIndex: 18, popularityScore: 84, description: "French colonial charm, Old Quarter chaos, and the best pho in the world." },
  { name: "Zurich", country: "Switzerland", region: "Europe", costIndex: 95, popularityScore: 78, description: "Pristine lake, Swiss precision, and fondue by candlelight." },
  { name: "Stockholm", country: "Sweden", region: "Europe", costIndex: 80, popularityScore: 80, description: "Archipelago islands, Nordic design, and midsummer magic." },
  { name: "Kuala Lumpur", country: "Malaysia", region: "Asia", costIndex: 30, popularityScore: 83, description: "Petronas Towers, hawker stalls, and a melting pot of cultures." },
  { name: "Milan", country: "Italy", region: "Europe", costIndex: 70, popularityScore: 84, description: "Fashion capital, Duomo di Milano, and aperitivo culture." },
  { name: "Osaka", country: "Japan", region: "Asia", costIndex: 55, popularityScore: 82, description: "Japan's kitchen — takoyaki, okonomiyaki, and neon-lit Dotonbori." },
  { name: "Cartagena", country: "Colombia", region: "South America", costIndex: 25, popularityScore: 79, description: "Colorful colonial walls, Caribbean breeze, and ceviche." },
  { name: "Queenstown", country: "New Zealand", region: "Oceania", costIndex: 70, popularityScore: 85, description: "Adventure capital of the world — bungee, fjords, and Pinot Noir." },
  { name: "Venice", country: "Italy", region: "Europe", costIndex: 75, popularityScore: 90, description: "Canals, gondolas, and Byzantine grandeur slowly sinking into the lagoon." },
  { name: "Krakow", country: "Poland", region: "Europe", costIndex: 30, popularityScore: 78, description: "A medieval market square, castles, and the salt mines of Wieliczka." },
  { name: "Jaipur", country: "India", region: "Asia", costIndex: 18, popularityScore: 80, description: "The Pink City — palaces, forts, and block-print textiles." },
  { name: "Auckland", country: "New Zealand", region: "Oceania", costIndex: 65, popularityScore: 76, description: "Volcanic cones, Maori heritage, and the gateway to Middle-earth." },
  { name: "Taipei", country: "Taiwan", region: "Asia", costIndex: 35, popularityScore: 81, description: "Night markets, hot springs, and Taipei 101 piercing the clouds." },
  { name: "Athens", country: "Greece", region: "Europe", costIndex: 45, popularityScore: 86, description: "The cradle of Western civilization — Acropolis, ouzo, and olive groves." },
  { name: "Florence", country: "Italy", region: "Europe", costIndex: 60, popularityScore: 91, description: "Renaissance birthplace, Uffizi Gallery, and the best gelato in Italy." },
  { name: "Havana", country: "Cuba", region: "North America", costIndex: 15, popularityScore: 77, description: "Crumbling Art Deco, vintage cars, salsa, and rum on the Malecon." },
  { name: "Chiang Mai", country: "Thailand", region: "Asia", costIndex: 15, popularityScore: 82, description: "Temple-dotted old city, elephant sanctuaries, and mountain treks." },
  { name: "Tallinn", country: "Estonia", region: "Europe", costIndex: 40, popularityScore: 72, description: "A perfectly preserved medieval old town with a booming tech scene." },
  { name: "Moscow", country: "Russia", region: "Europe", costIndex: 45, popularityScore: 75, description: "Red Square, onion domes, and the Bolshoi ballet." },
  { name: "Dublin", country: "Ireland", region: "Europe", costIndex: 70, popularityScore: 83, description: "Literary pubs, Georgian doors, and the warmth of Irish storytelling." },
  { name: "Lima", country: "Peru", region: "South America", costIndex: 30, popularityScore: 80, description: "Ceviche capital, pre-Columbian history, and Pacific cliffside dining." },
  { name: "Seville", country: "Spain", region: "Europe", costIndex: 45, popularityScore: 84, description: "Flamenco, orange-blossomed plazas, and Moorish alcazars." },
  { name: "Phuket", country: "Thailand", region: "Asia", costIndex: 25, popularityScore: 86, description: "Powder beaches, limestone karsts, and legendary island nightlife." },
  { name: "Munich", country: "Germany", region: "Europe", costIndex: 70, popularityScore: 83, description: "Oktoberfest, baroque churches, and beer gardens under chestnut trees." },
  { name: "Ljubljana", country: "Slovenia", region: "Europe", costIndex: 35, popularityScore: 70, description: "A fairy-tale capital of dragons, bridges, and alpine proximity." },
  { name: "Ho Chi Minh City", country: "Vietnam", region: "Asia", costIndex: 18, popularityScore: 81, description: "Motorbike chaos, French baguettes, and wartime tunnels." },
  { name: "Tbilisi", country: "Georgia", region: "Europe", costIndex: 20, popularityScore: 73, description: "Sulfur baths, Art Nouveau facades, and the birthplace of wine." },
  { name: "Toronto", country: "Canada", region: "North America", costIndex: 75, popularityScore: 82, description: "Multicultural neighborhoods, the CN Tower, and world-class cuisine." },
  { name: "Nairobi", country: "Kenya", region: "Africa", costIndex: 22, popularityScore: 74, description: "Urban safari — national park within city limits, Maasai markets, and coffee." },
];

function getActivities(cityName: string): Array<{
  name: string;
  description: string;
  type: ActivityType;
  estimatedCost: number;
  durationMinutes: number;
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
    }));
  }

  // Fallback generic activities for any city
  return [
    { name: `Walking Tour of ${cityName}`, description: "Explore the historic center with a local guide.", type: "sightseeing", estimatedCost: 0, durationMinutes: 120 },
    { name: `Local Market Visit`, description: "Browse fresh produce, spices, and artisan goods.", type: "food", estimatedCost: 15, durationMinutes: 90 },
    { name: `Museum Pass Day`, description: "Visit the top museums and galleries in the city.", type: "culture", estimatedCost: 25, durationMinutes: 240 },
    { name: `Sunset Viewpoint Hike`, description: "Climb to the best panoramic viewpoint at golden hour.", type: "adventure", estimatedCost: 0, durationMinutes: 120 },
    { name: `Cooking Class`, description: "Learn to prepare a traditional local dish hands-on.", type: "food", estimatedCost: 45, durationMinutes: 180 },
    { name: `Neighborhood Coffee Crawl`, description: "Hop between the city's best independent cafés.", type: "food", estimatedCost: 20, durationMinutes: 120 },
    { name: `Street Art Walking Route`, description: "Discover murals, graffiti, and urban art installations.", type: "culture", estimatedCost: 0, durationMinutes: 90 },
    { name: `Historic Quarter Exploration`, description: "Wander cobblestone streets and admire ancient architecture.", type: "sightseeing", estimatedCost: 0, durationMinutes: 150 },
    { name: `Local Craft Workshop`, description: "Make pottery, textiles, or jewelry with local artisans.", type: "culture", estimatedCost: 35, durationMinutes: 150 },
    { name: `Rooftop Bar Evening`, description: "Sip cocktails with panoramic city views after dark.", type: "food", estimatedCost: 40, durationMinutes: 120 },
    { name: `Bike Rental & City Loop`, description: "Pedal through parks, riversides, and hidden alleys.", type: "adventure", estimatedCost: 15, durationMinutes: 180 },
    { name: `Traditional Dance Show`, description: "Experience live folk or contemporary performance.", type: "culture", estimatedCost: 30, durationMinutes: 120 },
    { name: `Souvenir Shopping District`, description: "Browse local crafts, textiles, and unique gifts.", type: "shopping", estimatedCost: 50, durationMinutes: 120 },
    { name: `Local Park Picnic`, description: "Relax in the city's most beautiful green space.", type: "sightseeing", estimatedCost: 10, durationMinutes: 120 },
    { name: `Night Photography Walk`, description: "Capture illuminated landmarks and neon streets.", type: "adventure", estimatedCost: 0, durationMinutes: 120 },
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
