import { PresetTemplate } from '../types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  // Personal Care & Hygiene
  {
    id: 'toothbrush',
    title: 'Replace Toothbrush / Brush Head',
    category: 'personal',
    iconName: 'Smile',
    intervalValue: 90,
    intervalUnit: 'days',
    defaultLeadAlertDays: 7,
    description: 'Dentists and the ADA recommend swapping toothbrushes or electric brush heads every 3 months before bristles fray and harbor bacteria.',
    estimatedCost: '$4 - $15',
    difficulty: 'Quick (5m)',
    tips: [
      'Look for splayed bristles as an early sign of wear',
      'Always replace immediately after recovering from a cold or flu',
      'Store upright in an open container to allow bristles to air-dry'
    ],
    signsDue: ['Frayed, bent, or faded bristles', 'Toothbrush is over 3 months old', 'Recent illness']
  },
  {
    id: 'razor_blade',
    title: 'Replace Razor Blade',
    category: 'personal',
    iconName: 'Scissors',
    intervalValue: 14,
    intervalUnit: 'days',
    defaultLeadAlertDays: 2,
    description: 'Dull razor blades cause micro-cuts, razor burn, and folliculitis from microbial growth.',
    estimatedCost: '$2 - $5',
    difficulty: 'Quick (5m)',
    tips: [
      'Rinse thoroughly with hot water and dry after each shave',
      'Never wipe blades with a towel as it dulls the micro-edge',
      'Replace every 5-10 shaves or every 2 weeks'
    ],
    signsDue: ['Tugging sensation during shave', 'Skin irritation/red bumps', 'Visible oxidation on blade']
  },
  {
    id: 'loofah_sponge',
    title: 'Replace Bath Loofah / Pouf',
    category: 'personal',
    iconName: 'Bath',
    intervalValue: 30,
    intervalUnit: 'days',
    defaultLeadAlertDays: 3,
    description: 'Damp shower environments cause plastic and natural loofahs to accumulate dead skin and mildew quickly.',
    estimatedCost: '$3 - $8',
    difficulty: 'Quick (5m)',
    tips: [
      'Hang in a ventilated spot outside the shower stream between uses',
      'Natural sea sponges should be replaced every 3-4 weeks',
      'Plastic mesh poufs should be replaced every 4-6 weeks'
    ],
    signsDue: ['Musty odor', 'Discoloration or mildew spots', 'Unraveling mesh']
  },
  {
    id: 'water_bottle_deep_clean',
    title: 'Deep Sanitize Reusable Water Bottle',
    category: 'personal',
    iconName: 'GlassWater',
    intervalValue: 14,
    intervalUnit: 'days',
    defaultLeadAlertDays: 2,
    description: 'Deep soak bottles, gaskets, and silicone straws with warm soapy water and vinegar/baking soda to remove biofilm.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Disassemble silicone O-rings using a butter knife or toothpick',
      'Soak gaskets in a 1:1 mixture of white vinegar and water for 20 minutes',
      'Use a dedicated straw brush to scrub narrow airways'
    ],
    signsDue: ['Slimy film inside straw or cap', 'Unpleasant smell', 'Black mildew under silicone gasket']
  },

  // Bedding & Linen
  {
    id: 'wash_bed_sheets',
    title: 'Wash Bed Sheets & Duvet Cover',
    category: 'bedding',
    iconName: 'Bed',
    intervalValue: 14,
    intervalUnit: 'days',
    defaultLeadAlertDays: 2,
    description: 'Humans shed 500 million skin cells daily; washing bed sheets every 1-2 weeks eliminates dust mites and sweat buildup.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Wash in hot water (at least 60°C / 140°F) to sanitize and kill dust mites',
      'Tumble dry on medium heat or dry under direct sunlight for natural antibacterial action',
      'Rotate between 2-3 sets to extend sheet longevity'
    ],
    signsDue: ['Over 14 days since last wash', 'Stale scent or visible spots', 'Increased morning allergy/sneezing symptoms']
  },
  {
    id: 'wash_pillowcases',
    title: 'Wash Pillowcases',
    category: 'bedding',
    iconName: 'BedDouble',
    intervalValue: 7,
    intervalUnit: 'days',
    defaultLeadAlertDays: 1,
    description: 'Pillowcases directly contact facial skin, oils, hair products, and saliva; weekly washing drastically reduces skin breakouts.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Quick (5m)',
    tips: [
      'Wash weekly or even twice weekly if prone to acne',
      'Silk pillowcases should be washed in cold water with gentle detergent',
      'Flip pillows to the clean side halfway through the week'
    ],
    signsDue: ['Visible skin oil spots', 'Past 7 days since last laundry load', 'Facial acne flareups']
  },
  {
    id: 'rotate_mattress',
    title: 'Rotate & Flip Mattress',
    category: 'bedding',
    iconName: 'Layers',
    intervalValue: 180,
    intervalUnit: 'days',
    defaultLeadAlertDays: 7,
    description: 'Rotate your mattress 180 degrees (head to foot) every 6 months to distribute wear evenly and prevent body impressions.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Vacuum the mattress surface while sheets are off to remove dust mites',
      'Sprinkle baking soda, let sit for 1 hour, then vacuum for deep deodorization',
      'Check if your mattress is dual-sided before flipping upside down'
    ],
    signsDue: ['Uneven sagging or body impressions', 'Over 6 months since last rotation', 'Waking with lower back tightness']
  },
  {
    id: 'replace_pillows',
    title: 'Replace Sleeping Pillows',
    category: 'bedding',
    iconName: 'Moon',
    intervalValue: 365,
    intervalUnit: 'days',
    defaultLeadAlertDays: 14,
    description: 'Pillows lose spinal support and absorb moisture, sweat, and allergens over 1 to 2 years of daily use.',
    estimatedCost: '$25 - $80',
    difficulty: 'Quick (5m)',
    tips: [
      'Perform the fold test: fold pillow in half; if it does not spring back, it is dead',
      'Use washable zippered pillow protectors to prolong lifespan',
      'Memory foam pillows should be spot-cleaned rather than machine washed'
    ],
    signsDue: ['Fails fold test (stays folded)', 'Lumpy or flattened foam/feathers', 'Persistent yellow staining']
  },

  // HVAC & Appliances
  {
    id: 'clean_ac_filter',
    title: 'Clean / Wash Air Conditioner Filter',
    category: 'appliances',
    iconName: 'Wind',
    intervalValue: 30,
    intervalUnit: 'days',
    defaultLeadAlertDays: 3,
    description: 'Clogged AC mesh filters reduce airflow, increase electric bills by up to 15%, and blow dust back into the room.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Quick (5m)',
    tips: [
      'Vacuum loose dust first before rinsing mesh under lukewarm running water',
      'Ensure the filter is 100% dry before reinstalling into the unit to prevent mold',
      'Clean both indoor unit mesh filters and wipe louvers'
    ],
    signsDue: ['Reduced cooling airflow', 'Musty smell when AC starts', 'Visible grey layer of dust on filter grid']
  },
  {
    id: 'replace_hvac_hepa',
    title: 'Replace HVAC / Furnace HEPA Filter',
    category: 'appliances',
    iconName: 'Fan',
    intervalValue: 90,
    intervalUnit: 'days',
    defaultLeadAlertDays: 7,
    description: 'Central heating and cooling pleated filters require replacement every 90 days (or 60 days with furry pets).',
    estimatedCost: '$15 - $35',
    difficulty: 'Quick (5m)',
    tips: [
      'Check the airflow arrow printed on the filter frame before sliding in',
      'Write the installation date with a Sharpie on the cardboard edge',
      'MERV 8 to 11 is optimal for standard residential airflow'
    ],
    signsDue: ['Cardboard filter is dark grey/brown', 'HVAC runs continuously without reaching set temp', 'Dust settling quickly on furniture']
  },
  {
    id: 'fridge_water_filter',
    title: 'Replace Refrigerator Water Filter',
    category: 'appliances',
    iconName: 'Droplets',
    intervalValue: 180,
    intervalUnit: 'days',
    defaultLeadAlertDays: 14,
    description: 'Refrigerator carbon filters saturate after 6 months or 200-300 gallons, allowing contaminants and chlorine into drinking water.',
    estimatedCost: '$25 - $50',
    difficulty: 'Quick (5m)',
    tips: [
      'Locate your exact fridge model number on the inner wall door sticker',
      'Flush 3-4 gallons through the new filter before drinking to clear carbon fines',
      'Hold the "Filter Reset" button on the dispenser panel for 3 seconds after swapping'
    ],
    signsDue: ['Slow water dispenser flow rate', 'Water tastes metallic or like tap chlorine', 'Filter status LED turns red']
  },
  {
    id: 'descale_coffee_machine',
    title: 'Descale Coffee & Espresso Machine',
    category: 'appliances',
    iconName: 'Coffee',
    intervalValue: 60,
    intervalUnit: 'days',
    defaultLeadAlertDays: 5,
    description: 'Hard water minerals scale inside boilers and pumps, dropping brew temperature and eventually burning out heating elements.',
    estimatedCost: '$5 - $15',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Use manufacturer descaling solution or citric acid rather than pungent vinegar for sensitive thermoblocks',
      'Run 2 full water reservoir flushes after descaling cycle',
      'Clean shower screen and portafilter basket with a wire brush'
    ],
    signsDue: ['Slow or sputtering coffee flow', 'Lukewarm coffee', 'Machine pump sounds strained']
  },
  {
    id: 'dishwasher_deep_clean',
    title: 'Deep Clean Dishwasher & Drain Filter',
    category: 'appliances',
    iconName: 'Sparkles',
    intervalValue: 30,
    intervalUnit: 'days',
    defaultLeadAlertDays: 3,
    description: 'Food particles and grease clog the cylindrical floor filter and spray arms, leaving foggy residue on glasses.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Twist and remove the bottom cylindrical mesh filter and scrub under warm water',
      'Place a bowl of white vinegar on top rack and run a hot cycle',
      'Clear clogged spray arm holes using a wooden toothpick'
    ],
    signsDue: ['Dishes come out with gritty grit/film', 'Stagnant odor inside tub', 'Water drains slowly from bottom basin']
  },
  {
    id: 'washing_machine_tub_clean',
    title: 'Washing Machine Tub Self-Clean Cycle',
    category: 'appliances',
    iconName: 'Shirt',
    intervalValue: 30,
    intervalUnit: 'days',
    defaultLeadAlertDays: 3,
    description: 'Detergent scum and moisture build up behind the drum and front rubber door gasket, breeding sour mildew.',
    estimatedCost: '$3 - $10',
    difficulty: 'Quick (5m)',
    tips: [
      'Use a dedicated washing machine cleaning tablet (e.g., Affresh) on the Tub Clean cycle',
      'Wipe down the rubber door bellows with a damp microfiber cloth',
      'Leave the washer door cracked open 2 inches between loads to dry out the drum'
    ],
    signsDue: ['Freshly washed clothes smell sour or musty', 'Black spots on rubber gasket fold', 'Visible soap scum rim']
  },
  {
    id: 'dryer_vent_clean',
    title: 'Clean Dryer Lint Trap Duct & Exhaust Vent',
    category: 'appliances',
    iconName: 'Flame',
    intervalValue: 90,
    intervalUnit: 'days',
    defaultLeadAlertDays: 7,
    description: 'Lint buildup in the internal lint cavity and outside exhaust duct is the #1 cause of residential household fires.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Use a long flexible lint trap brush to vacuum inside the lint trap slot',
      'Check the outside exhaust flapper to make sure air blows vigorously when dryer is running',
      'Never use flexible plastic foil ducts — rigid metal ducts are fire-safe'
    ],
    signsDue: ['Clothes take 2+ cycles to dry', 'Dryer top surface feels unusually hot', 'Burning lint smell in laundry room']
  },

  // Vehicle Maintenance
  {
    id: 'car_oil_change',
    title: 'Car Engine Oil & Filter Change',
    category: 'vehicle',
    iconName: 'Car',
    intervalValue: 180,
    intervalUnit: 'days',
    defaultLeadAlertDays: 14,
    description: 'Engine oil degrades and collects soot over time. Change every 5,000 to 7,500 miles or every 6 months to protect engine life.',
    estimatedCost: '$45 - $90',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Always replace the oil filter alongside fresh synthetic oil',
      'Check oil dipstick level and color on level ground when engine is cold',
      'Log your odometer reading in the notes for precise mileage tracking'
    ],
    signsDue: ['Oil maintenance light illuminated', 'Dark amber/black oil on dipstick', '6 months or 5,000+ miles since last service']
  },
  {
    id: 'car_tire_rotation',
    title: 'Car Tire Rotation & Pressure Check',
    category: 'vehicle',
    iconName: 'Disc',
    intervalValue: 180,
    intervalUnit: 'days',
    defaultLeadAlertDays: 7,
    description: 'Front tires carry steering and braking weight; rotating front-to-back balances tread wear and extends tire life by years.',
    estimatedCost: '$20 - $40 (or free with tires)',
    difficulty: 'Quick (5m)',
    tips: [
      'Inspect cold tire PSI against the driver door jamb sticker',
      'Inspect tread depth using the penny test (Lincoln head upside down)',
      'Check tire balance if you feel steering wheel vibration at highway speeds'
    ],
    signsDue: ['Uneven tread wear on inner or outer edges', 'Steering vibration at 60mph', '6 months since last rotation']
  },
  {
    id: 'car_cabin_filter',
    title: 'Replace Car Cabin & Engine Air Filters',
    category: 'vehicle',
    iconName: 'Fuel',
    intervalValue: 365,
    intervalUnit: 'days',
    defaultLeadAlertDays: 14,
    description: 'Cabin filter cleans AC airflow entering the passenger compartment; engine filter protects throttle and cylinders from road debris.',
    estimatedCost: '$20 - $45',
    difficulty: 'Quick (5m)',
    tips: [
      'Most cabin filters are easily accessible behind the glove box without tools',
      'Engine air filter usually clips into a black airbox under the hood with 2 clips',
      'Replace yearly or every 15,000 miles'
    ],
    signsDue: ['Weak AC / defroster airflow', 'Musty smell inside vehicle cabin', 'Visible leaves or black grime on filter pleats']
  },
  {
    id: 'car_wiper_blades',
    title: 'Replace Windshield Wiper Blades',
    category: 'vehicle',
    iconName: 'CloudRain',
    intervalValue: 180,
    intervalUnit: 'days',
    defaultLeadAlertDays: 7,
    description: 'Sun UV rays and freezing weather dry out the rubber squeegee edges, causing dangerous streaking during heavy rain.',
    estimatedCost: '$20 - $45',
    difficulty: 'Quick (5m)',
    tips: [
      'Place a towel on the windshield glass while changing arms to avoid accidental glass cracking',
      'Driver and passenger sides often use different blade lengths (e.g., 26" and 18")',
      'Clean blades monthly with rubbing alcohol on a paper towel'
    ],
    signsDue: ['Streaking or chattering across glass', 'Squeaking noise in operation', 'Rubber edge peeling off metal frame']
  },

  // Pet Care
  {
    id: 'dog_vaccinations',
    title: 'Pet Annual Vaccinations & Vet Exam',
    category: 'pets',
    iconName: 'Dog',
    intervalValue: 365,
    intervalUnit: 'days',
    defaultLeadAlertDays: 21,
    description: 'Annual booster shots for Rabies, DHPP / DAPP (Distemper, Parvo), Bordetella, plus annual health and dental exam.',
    estimatedCost: '$90 - $250',
    difficulty: 'In-Depth (1h+)',
    tips: [
      'Schedule 2-3 weeks in advance as vet clinics book out quickly',
      'Request digital vaccination certificate for grooming, boarding, or travel',
      'Ask vet to test stool sample for internal parasites during checkup'
    ],
    signsDue: ['Vaccination certificate approaching 1-year expiration', 'Over 12 months since last full vet examination']
  },
  {
    id: 'dog_flea_tick_pill',
    title: 'Pet Flea, Tick & Heartworm Preventative',
    category: 'pets',
    iconName: 'ShieldAlert',
    intervalValue: 30,
    intervalUnit: 'days',
    defaultLeadAlertDays: 2,
    description: 'Monthly chewable (e.g., NexGard, Simparica Trio, Heartgard) to prevent fatal heartworm disease and tick-borne Lyme disease.',
    estimatedCost: '$20 - $35 / mo',
    difficulty: 'Quick (5m)',
    tips: [
      'Give with food to aid absorption and prevent upset stomach',
      'Missing even a single month leaves pets vulnerable to mosquito-transmitted heartworms',
      'Log the exact brand in the task notes'
    ],
    signsDue: ['30 days elapsed since last chewable tablet', 'New calendar month starting']
  },
  {
    id: 'pet_grooming_nails',
    title: 'Pet Bath, Ear Clean & Nail Trim',
    category: 'pets',
    iconName: 'Footprints',
    intervalValue: 21,
    intervalUnit: 'days',
    defaultLeadAlertDays: 3,
    description: 'Overgrown nails can curl into paw pads or shift skeletal alignment; clean ears prevent bacterial yeast infections.',
    estimatedCost: '$15 - $65',
    difficulty: 'Moderate (15-30m)',
    tips: [
      'Listen for clicking sounds on hard floors as the indicator nails are too long',
      'Use styptic powder ready nearby in case you accidentally clip the quick',
      'Use a pet-specific pH-balanced ear flush'
    ],
    signsDue: ['Nails clicking loudly on tile or hardwood', 'Brown buildup or scratching at ears', 'Strong dog odor']
  },

  // Safety & Electrical
  {
    id: 'smoke_detector_test',
    title: 'Test Smoke & Carbon Monoxide Detectors',
    category: 'safety',
    iconName: 'BellRing',
    intervalValue: 180,
    intervalUnit: 'days',
    defaultLeadAlertDays: 5,
    description: 'Test test-button audio and replace 9V backup batteries twice yearly (often aligned with daylight saving time clocks).',
    estimatedCost: '$5 - $15',
    difficulty: 'Quick (5m)',
    tips: [
      'Hold the "Test" button for 5 seconds until the piercing beep sounds',
      'Smoke detector units themselves expire after 10 years and must be completely replaced',
      'Clean dust off the sensor vents with a canned air duster'
    ],
    signsDue: ['Occasional chirping beep sound', '6 months since last battery swap', 'Unit is nearing 10-year expiration stamp']
  },
  {
    id: 'fire_extinguisher_check',
    title: 'Inspect Home Fire Extinguishers',
    category: 'safety',
    iconName: 'FlameKindling',
    intervalValue: 365,
    intervalUnit: 'days',
    defaultLeadAlertDays: 7,
    description: 'Verify pressure needle is in the green zone, the safety pin & tamper seal are intact, and powder has not caked.',
    estimatedCost: 'Free / DIY',
    difficulty: 'Quick (5m)',
    tips: [
      'Turn the extinguisher upside down and shake vigorously to keep dry chemical powder loose',
      'Ensure it is mounted in an accessible location near kitchen exit and garage',
      'Replace if gauge needle drops into the red recharge zone'
    ],
    signsDue: ['Pressure needle is in the red zone', 'Missing safety pin', 'Corrosion or dented canister']
  }
];

export const CATEGORY_INFO: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  personal: { label: 'WELLNESS', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'Smile' },
  bedding: { label: 'HOME / LINEN', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'Bed' },
  appliances: { label: 'HVAC & HOME', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'Fan' },
  vehicle: { label: 'VEHICLE / AUTO', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'Car' },
  pets: { label: 'PET HEALTH', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'Dog' },
  safety: { label: 'HOME SAFETY', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'ShieldAlert' },
  outdoor: { label: 'OUTDOOR', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'TreePine' },
  tech: { label: 'ELECTRONICS', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'Laptop' },
  other: { label: 'HOUSEHOLD', color: 'text-[#F5F5F5]', bg: 'bg-[#171717] border-[#262626]', icon: 'CheckCircle2' },
};
