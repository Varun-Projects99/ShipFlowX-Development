/**
 * ShipFlowX AI Assistant Response Service
 * 
 * Binds user messages to structured answers based on logistics keywords.
 * Ready for future backend integration with Gemini, OpenAI, or Express server hooks.
 */

// Keyword mappings matching user queries
const RESPONSE_MAP = [
  {
    keywords: ['book', 'booking', 'reserve', 'create shipment', 'send package', 'dispatch package', 'bangalore', 'usa'],
    reply: "I can help you coordinate and book your international shipment immediately!\n\n" +
           "You can use our interactive **5-Step Booking Wizard** to compute volumetric pricing, specify your dimensions, secure your payment, and print your tracking waybill.\n\n" +
           "Click the button below to start:\n\n" +
           "**[Book Shipment Now](/book)**"
  },
  {
    keywords: ['cost', 'price', 'rate', 'quote', 'charge', 'tariff', 'fee', 'calculate', 'expensive'],
    reply: "Our shipping costs depend on the **chargeable weight** (the greater of physical and volumetric weight) and the **Service Priority**.\n\n" +
           "• **Eco Saver**: Best for heavy cargo. Calculated at `0.8x` multiplier of base rates.\n" +
           "• **Standard Freight**: Balanced pricing at `1.2x` base rates.\n" +
           "• **Express Priority**: Guaranteed fast routing at `2.5x` base rates.\n\n" +
           "You can use our **Rate Calculator** page from the top menu to estimate tariffs instantly."
  },
  {
    keywords: ['time', 'duration', 'days', 'hours', 'fast', 'slow', 'arrive', 'speed', 'long'],
    reply: "Shipment delivery times are determined by the selected transport method:\n\n" +
           "• **Express Priority (Air)**: Takes **1 - 2 business days** globally.\n" +
           "• **Standard Freight (Air/Sea)**: Takes **3 - 6 business days**.\n" +
           "• **Eco Saver (Ocean/Land)**: Takes **8 - 14 business days** depending on port proximity.\n\n" +
           "Transit timetables can fluctuate during high-volume periods or customs screenings."
  },
  {
    keywords: ['delay', 'late', 'stuck', 'hold', 'backlog', 'waiting'],
    reply: "If your cargo is marked as delayed or stuck:\n\n" +
           "1. **Customs Backlog**: International border ports inspect manifests. Make sure all **declaration documents** are submitted.\n" +
           "2. **Weather Disruption**: Air cargo flights and sea liners can change routes for safety.\n\n" +
           "Check your tracking ID on the **Track Shipment** screen. If it is on hold for more than `48 hours`, contact our Operations Hub at **+1 (800) 555-FLOW**."
  },
  {
    keywords: ['status', 'progress', 'booked', 'dispatched', 'transit', 'delivered'],
    reply: "Your shipment status progresses through 5 standard operations nodes:\n\n" +
           "• `Booked`: Shipment registry created.\n" +
           "• `Dispatched`: Package left origin sorting center.\n" +
           "• `In Transit`: Parcel traveling on air or ocean carriers.\n" +
           "• `Out for Delivery`: Loaded on local delivery vehicle.\n" +
           "• `Delivered`: Consignee signed receipt.\n\n" +
           "Verify your current location status using the **Track Shipment** tracker in the header."
  },
  {
    keywords: ['air vs sea', 'sea vs air', 'cheaper', 'ocean', 'vessel', 'plane', 'flight', 'ship', 'carrier', 'company', 'rates', 'cheap'],
    reply: "Here is a comparative breakdown of rates, transit times, and features across different shipping companies and vessels:\n\n" +
           "### 🚢 Ocean Cargo (Cheaper Options)\n" +
           "• **Pacific Star Liners** (Vessel: *Evergreen Carrier*)\n" +
           "  - **Rate**: Cheapest (`$8 - $12 / kg` billable)\n" +
           "  - **Duration**: `18 Days` (Shanghai to Rotterdam)\n" +
           "  - **Best For**: Bulk non-fragile consignments.\n" +
           "• **Atlantic Shipping Corp** (Vessel: *Atlantic Titan*)\n" +
           "  - **Rate**: Economy (`$10 - $14 / kg` billable)\n" +
           "  - **Duration**: `10 Days` (Hamburg to Newark)\n\n" +
           "### ✈️ Air Freight (Higher Fee / Premium Features)\n" +
           "• **SF Air Express** (Aircraft: *Boeing 777-F*)\n" +
           "  - **Rate**: Premium (`$22 - $28 / kg` billable)\n" +
           "  - **Duration**: `14 Hours` (Hong Kong to Los Angeles)\n" +
           "  - **Best For**: Urgent or fragile shipments.\n" +
           "• **Transatlantic Express** (Aircraft: *Airbus A330-F*)\n" +
           "  - **Rate**: Ultra-Premium (`$30 - $35 / kg` billable)\n" +
           "  - **Duration**: `8 Hours` (London to New York)\n" +
           "  - **Features**: Includes 24/7 active tracking and premium cargo insurance.\n\n" +
           "You can book any of these services instantly using our **[Book Shipment Now](/book)** tool."
  },
  {
    keywords: ['document', 'paperwork', 'invoice', 'manifest', 'forms', 'declaration', 'clearance'],
    reply: "For standard international cargo clearance, make sure you prepare:\n\n" +
           "1. **Commercial Invoice**: Detailing shipper info, description, and commercial value.\n" +
           "2. **Packing List**: Detailing itemized dimensions and weight.\n" +
           "3. **Waybill / Bill of Lading**: Signed copy of cargo registry.\n" +
           "4. **Customs Declarations**: Region-specific forms (e.g. HS tariff codes).\n\n" +
           "Admin coordinators will alert you if any documents are missing."
  },
  {
    keywords: ['restricted', 'prohibited', 'ban', 'danger', 'battery', 'liquid', 'hazard', 'weapon', 'illegal'],
    reply: "We prohibit or restrict items that pose safety hazards in transit:\n\n" +
           "• **Banned Completely**: Explosives, weapons, illegal substances, and chemical hazards.\n" +
           "• **Restricted (Requires approval)**: Lithium batteries, aerosols, perfumes, liquids, and perishable items.\n\n" +
           "Make sure to declare all contents in Step 3 of the booking wizard. Failure to declare restricted goods will result in a **Customs Hold**."
  },
  {
    keywords: ['track', 'locate', 'search', 'waybill', 'code', 'number'],
    reply: "Tracking your shipment on ShipFlowX is simple:\n\n" +
           "1. Obtain your waybill tracking code (formatted as `SFX-XXXXXXX`).\n" +
           "2. Type it into the search box on the **Track Shipment** page or the home page.\n" +
           "3. You will immediately see the route progress bar, current location address, and transit log events."
  },
  {
    keywords: ['packaging', 'packing', 'pack', 'box', 'wrap', 'secure', 'fragile'],
    reply: "Secure packaging prevents damage and optimizes volumetric tariffs:\n\n" +
           "• **Box Quality**: Use double-walled cardboard boxes for items exceeding `10 kg`.\n" +
           "• **Cushioning**: Wrap items in bubble wrap; fill voids with packing peanuts.\n" +
           "• **Sealing**: Use H-tape method (sealing middle seams and edges) with heavy-duty packing tape.\n" +
           "• **Fragile Goods**: Label the package clearly and declare it to ensure careful handling by sorting teams."
  },
  {
    keywords: ['insurance', 'coverage', 'damage', 'lost', 'protect', 'claims'],
    reply: "We offer **ShipFlowX Freight Shield** to protect your investments in transit:\n\n" +
           "• **Basic Coverage**: Included automatically, covering up to `$100` value.\n" +
           "• **Premium Shield**: Optional add-on costing `1.5%` of declared package value, covering full replacement costs for damage, loss, or customs seizures.\n\n" +
           "Claims must be filed within `14 days` of delivery with photos of package and invoices."
  },
  {
    keywords: ['customs', 'duties', 'tax', 'inspection', 'border'],
    reply: "Customs clearance inspections happen at international borders:\n\n" +
           "• **Import Duties/Taxes**: Sized by the destination country based on HS code and declared value.\n" +
           "• **Brokerage**: ShipFlowX handles brokerage representation automatically to speed up port clearing.\n\n" +
           "Make sure all declared invoice values match physical cargo to prevent inspection fines."
  },
  {
    keywords: ['international', 'global', 'export', 'import', 'border', 'cross'],
    reply: "ShipFlowX provides cross-border services spanning over **120 countries**:\n\n" +
           "• We handle customs brokerage, transit manifest files, and cargo handling operations.\n" +
           "• Delivery times range from `2 days` (Express Air) to `14 days` (Economy Ocean).\n\n" +
           "Select origin and destination countries in the Booking Flow to review valid routes."
  }
];

/**
 * Returns a simulated AI response after a network-like latency delay.
 * 
 * @param {string} userMessage The query message typed by the user
 * @returns {Promise<{text: string, timestamp: Date}>} The response payload
 */
export const getAIResponse = (userMessage) => {
  return new Promise((resolve) => {
    // Simulate network API latency
    setTimeout(() => {
      const query = userMessage.toLowerCase().trim();
      let matchedReply = null;

      // Scan RESPONSE_MAP for keyword matches
      for (const item of RESPONSE_MAP) {
        if (item.keywords.some(kw => query.includes(kw))) {
          matchedReply = item.reply;
          break;
        }
      }

      // Default reply fallback
      if (!matchedReply) {
        matchedReply = "I understand you are asking about logistics. I didn't find specific details matching your query.\n\n" +
                       "For direct help, you can ask me about **shipping costs**, **delivery times**, **air vs sea cargo**, **restricted items**, or **customs documentation**.\n\n" +
                       "You can also reach our operations helpline directly at **operations@shipflowx.com**.";
      }

      resolve({
        text: matchedReply,
        timestamp: new Date()
      });
    }, 1200); // 1.2 second simulated AI thought process delay
  });
};
