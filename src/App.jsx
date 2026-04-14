import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const VENUES = [
  { id:1, name:"BISTECCA", category:"dining", area:"CBD", address:"3 Dalley St, Sydney NSW 2000", lat:-33.863, lng:151.208, rating:4.7, reviews:2080, price:"$$$", style:"Subterranean Italian steakhouse", palette:"Dark timber, candlelight, aged brick", colors:["#2C1810","#8B4513","#D4A574","#1A0F0A"], hasPrivateRoom:true, privateRoomNote:"Enoteca (8 guests) / Cappelletti Room (14–16 guests)", proposalScore:5, tags:["intimate","no-phones policy","fireplace","heritage"], capacity:"50 seats + private rooms", summary:"A hidden basement steakhouse where phones are locked away in antique cabinets. T-bones cooked over ironbark by an open hearth. The Cappelletti Room seats 14 for private dining with a curated Italian wine list. The no-phone policy creates genuine presence — ideal for a proposal where every second matters.", phone:"+61 2 8067 0450", hours:"Daily 12 pm – 12 am", website:"liquidandlarder.com.au/venues/bistecca", bestFor:"Intimate proposals for 2, private group celebrations up to 16" },
  { id:2, name:"Bennelong", category:"dining", area:"Circular Quay", address:"Sydney Opera House, Bennelong Point", lat:-33.857, lng:151.215, rating:4.5, reviews:2136, price:"$$$$", style:"Modern Australian, landmark setting", palette:"Warm white, timber, harbour light", colors:["#F5F0E8","#C4A87C","#2C3E50","#E8D5B7"], hasPrivateRoom:false, privateRoomNote:"No private room — the setting speaks for itself", proposalScore:5, tags:["iconic","harbour view","fine dining","Opera House"], capacity:"~80 seats", summary:"Inside the Sydney Opera House. Sweeping views of the harbour through sculptural concrete shells. Three-course and tasting menus showcase impeccable Australian produce. The architecture alone makes this a once-in-a-lifetime backdrop for a proposal. Request a window table facing the Harbour Bridge.", phone:"+61 2 9240 8000", hours:"Mon–Sun dinner; Fri–Sun lunch", website:"bennelong.com.au", bestFor:"Grand gesture proposals, milestone anniversaries, impressing international guests" },
  { id:3, name:"LuMi Dining", category:"dining", area:"Pyrmont", address:"56 Pirrama Rd, Pyrmont NSW 2009", lat:-33.867, lng:151.197, rating:4.5, reviews:1159, price:"$$$$", style:"Japanese-Italian omakase", palette:"Clean white, natural wood, water reflections", colors:["#FAFAFA","#D4C5A9","#4A6741","#2D2D2D"], hasPrivateRoom:false, privateRoomNote:"Window-side water view seating on request", proposalScore:4, tags:["omakase","waterfront","refined","quiet"], capacity:"~40 seats", summary:"Chef Federico's 18-course tasting menu fuses Japanese precision with Italian warmth. Overlooking Pyrmont Bay, the space is serene and art-like. Regulars return for anniversaries year after year. The quiet atmosphere and long, paced meal create natural conversation — perfect for building to an important moment.", phone:"+61 2 9571 1999", hours:"Thu–Sun dinner; Sat–Sun lunch", website:"lumidining.com", bestFor:"Foodie couples, quiet and refined proposals, anniversary dinners" },
  { id:4, name:"Palace Rose Garden", category:"garden", area:"Royal Botanic Garden", address:"Mrs Macquaries Rd, Sydney NSW 2000", lat:-33.865, lng:151.214, rating:4.7, reviews:238, price:"Free (permit required)", style:"Heritage rose garden, open air", palette:"Deep green, rose pink, sandstone", colors:["#2D5A27","#E8B4B8","#F5E6CA","#8FBC8F"], hasPrivateRoom:false, privateRoomNote:"Open-air — event permit required from Botanic Gardens Trust", proposalScore:5, tags:["outdoor","roses","harbour backdrop","free entry"], capacity:"Outdoor, flexible", summary:"A quiet garden of heritage roses within the Royal Botanic Garden. The harbour glimmers behind old stone walls. Free to visit, but private events require a permit from the Botanic Gardens Trust. Best at golden hour when the sandstone walls glow warm. Pair with a picnic setup or a simple bouquet among the roses.", phone:"+61 2 9231 8111", hours:"Daily 7 am – 6:30 pm", website:"botanicgardens.nsw.gov.au", bestFor:"Outdoor proposals, golden hour photography, budget-conscious but beautiful" },
  { id:5, name:"Lords Estate Heritage Chapel", category:"chapel", area:"Seven Hills", address:"313 Seven Hills Rd, Seven Hills NSW 2147", lat:-33.760, lng:150.954, rating:5.0, reviews:118, price:"$$", style:"State heritage chapel and manor", palette:"Warm brick, cream, deep green", colors:["#8B4513","#FFF8F0","#355E3B","#D2B48C"], hasPrivateRoom:true, privateRoomNote:"Entire chapel and grounds available for private booking", proposalScore:5, tags:["heritage","chapel","5.0 rating","personal service"], capacity:"Chapel ~100 guests", summary:"A perfect 5.0 rating across 118 reviews. A state heritage-listed chapel with stained glass and manicured grounds. Owner Claire provides deeply personal service — guests describe feeling like family. She has helped couples with everything from finding officiants to last-minute weather contingencies. The chapel's intimacy and history make every moment feel significant.", phone:"+61 2 8006 4346", hours:"Mon–Fri 8 am – 6 pm; weekends extended", website:"lordsestate.com.au", bestFor:"Proposals with religious or heritage significance, intimate ceremonies" },
  { id:6, name:"Watersedge", category:"waterfront", area:"The Rocks", address:"25 Hickson Rd, The Rocks NSW 2000", lat:-33.857, lng:151.209, rating:4.4, reviews:112, price:"$$$", style:"Heritage warehouse, harbour frontage", palette:"Sandstone, navy, warm amber", colors:["#C2B280","#1B3A4B","#F5DEB3","#2C1810"], hasPrivateRoom:true, privateRoomNote:"Multiple bays with string lights, direct Opera House view", proposalScore:4, tags:["Opera House view","heritage","atmospheric","waterfront"], capacity:"Multiple configurations", summary:"Campbell's Stores — Sydney's oldest commercial building, now a waterfront event venue. Stone archways frame the Opera House across the water. Multiple bays available with atmospheric string lighting. The heritage architecture gives weight and texture to photographs. Best at sunset when the sandstone catches golden light.", phone:"+61 2 9251 5630", hours:"Daily 7 am – 12 am", website:"watersedge.com.au", bestFor:"Mid-size celebrations, Opera House backdrop, atmospheric evening events" },
  { id:7, name:"Zest Waterfront", category:"waterfront", area:"Point Piper", address:"21 Wunulla Rd, Point Piper NSW 2027", lat:-33.867, lng:151.254, rating:4.8, reviews:332, price:"$$$$", style:"Premium waterfront, full-service", palette:"Ocean blue, white, silver", colors:["#1B4F72","#FFFFFF","#BDC3C7","#2E86C1"], hasPrivateRoom:true, privateRoomNote:"Exclusive use — ceremony and reception on site", proposalScore:5, tags:["premium","harbour","all-inclusive","award-winning"], capacity:"Large events", summary:"One of Sydney's most awarded waterfront venues. Point Piper location with uninterrupted harbour views. Full ceremony-to-reception service with a team known for flawless execution. The venue handles everything from catering to coordination, allowing you to focus entirely on the moment.", phone:"+61 2 9327 3441", hours:"Mon–Fri 9 am – 5 pm (events unrestricted)", website:"zestwaterfrontvenues.com.au", bestFor:"Premium celebrations, large parties, all-inclusive planning" },
  { id:8, name:"Springfield House", category:"garden", area:"Dural", address:"245 New Line Rd, Dural NSW 2158", lat:-33.702, lng:151.023, rating:4.6, reviews:263, price:"$$$", style:"Country estate, garden lawns", palette:"Forest green, linen, warm timber", colors:["#4A7C59","#FAF0E6","#8B7355","#DEB887"], hasPrivateRoom:true, privateRoomNote:"The Manor (indoor) + The Gardens (outdoor ceremony)", proposalScore:4, tags:["countryside","estate","gardens","dedicated planner"], capacity:"Multiple configurations", summary:"A pastoral estate in Sydney's Hills District. Rolling lawns for outdoor ceremonies, a heritage manor for receptions. Coordinators Monique and Hannah are consistently praised across hundreds of reviews for their calm and thorough approach. The drive out of the city adds to the sense of occasion.", phone:"+61 2 9651 2144", hours:"Tue–Fri 10 am – 4 pm; Sat morning", website:"springfieldhouse.com.au", bestFor:"Garden proposals, countryside escape from the city, relaxed celebrations" },
  { id:9, name:"Miramare Gardens", category:"garden", area:"Terrey Hills", address:"48 Myoora Rd, Terrey Hills NSW 2084", lat:-33.689, lng:151.223, rating:4.4, reviews:793, price:"$$$", style:"European-style garden estate", palette:"Emerald, cream, antique gold", colors:["#355E3B","#FFFDD0","#C5B358","#8B7355"], hasPrivateRoom:true, privateRoomNote:"Multiple indoor/outdoor spaces, on-site accommodation", proposalScore:4, tags:["European","estate","accommodation","established"], capacity:"Multiple venue sizes", summary:"A long-established estate with European-influenced gardens, multiple ceremony and reception spaces, and on-site hotel rooms. Formal but warm — a traditional choice with broad appeal. The on-site accommodation makes it practical for multi-day celebrations or out-of-town guests.", phone:"+61 2 9450 2000", hours:"Daily 9 am – 5 pm", website:"miramare.com.au", bestFor:"Traditional celebrations, multi-day events, guests needing accommodation" },
  { id:10, name:"The Sanderson", category:"dining", area:"CBD", address:"285 George St, Sydney NSW 2000", lat:-33.865, lng:151.207, rating:4.7, reviews:402, price:"$$$", style:"Modern fine dining, celebration-oriented", palette:"Charcoal, brushed copper, amber glow", colors:["#2C2C2C","#B8860B","#D4A574","#1A1A1A"], hasPrivateRoom:false, privateRoomNote:"Special occasion arrangements and complimentary gifts", proposalScore:4, tags:["celebration","fine dining","attentive service","steak"], capacity:"Mid-size restaurant", summary:"A polished steak-focused restaurant that goes out of its way for celebrations — complimentary gifts, personalised touches. Reviewers consistently describe it as ideal for anniversaries and milestones. The staff are trained to support special occasions discreetly without drawing unwanted attention.", phone:"+61 2 7225 5559", hours:"Tue–Sat dinner; Wed–Fri lunch", website:"thesanderson.com.au", bestFor:"Anniversary dinners, celebration meals, discreet special-occasion support" },
  { id:11, name:"The Old St Thomas Chapel", category:"chapel", area:"Narellan", address:"1A Wilson Cres, Narellan NSW 2567", lat:-34.043, lng:150.732, rating:4.9, reviews:51, price:"$$", style:"Heritage sandstone chapel", palette:"Warm stone, stained glass, aged timber", colors:["#C2B280","#8B4513","#FFF8F0","#556B2F"], hasPrivateRoom:true, privateRoomNote:"Entire chapel for private ceremony, fits ~130 guests", proposalScore:5, tags:["heritage","stained glass","intimate","owner-operated"], capacity:"~130 guests", summary:"A beautifully preserved sandstone chapel with high ceilings and stained glass. Owner Kylie provides hands-on support — finding officiants, managing music, adjusting details at the aisle. Deeply personal and deeply cared for. The natural light through stained glass creates an atmosphere no decorator could replicate.", phone:"+61 411 552 488", hours:"Mon–Fri 9 am – 4 pm; Sat 10 am – 3 pm", website:"oldstthomas.com.au", bestFor:"Chapel proposals, faith-connected moments, photogenic stained-glass setting" },
  { id:12, name:"NOMAD Sydney", category:"dining", area:"Surry Hills", address:"16 Foster St, Surry Hills NSW 2010", lat:-33.880, lng:151.210, rating:4.6, reviews:2781, price:"$$$", style:"Wood-fired modern Australian", palette:"Warm grey, terracotta, natural timber", colors:["#8B8682","#DEB887","#CD853F","#2F2F2F"], hasPrivateRoom:false, privateRoomNote:"Open-plan space, section reservations possible", proposalScore:3, tags:["wood-fire","social dining","inner-city","feast menu"], capacity:"Large restaurant", summary:"A buzzing Surry Hills institution built around an open wood-fire kitchen. The Feast shared menu suits groups celebrating together. The atmosphere is lively rather than hushed — better for post-proposal celebrations with friends than a quiet, whispered moment.", phone:"+61 2 9280 3395", hours:"Daily, lunch and dinner", website:"nomadwine.com.au", bestFor:"Post-proposal group celebrations, social dining with friends and family" },
  { id:13, name:"The Rooftop Sydney", category:"rooftop", area:"CBD", address:"Level 3/200 Sussex St, Sydney NSW 2000", lat:-33.871, lng:151.204, rating:4.1, reviews:72, price:"$$", style:"Urban rooftop bar and event space", palette:"City grey, neon accents, night sky", colors:["#1A1A2E","#16213E","#E94560","#0F3460"], hasPrivateRoom:true, privateRoomNote:"Full venue hire with dance floor and DJ booth", proposalScore:3, tags:["rooftop","city views","party","flexible"], capacity:"Large capacity", summary:"A retractable-roof rooftop bar overlooking Darling Harbour. More suited to party-style events than intimate proposals. The energy is urban and social. Best for engagement parties or milestone birthday celebrations rather than quiet, one-on-one moments.", phone:"+61 2 9267 3100", hours:"Wed–Fri 11:30 am; Sat afternoon", website:"therooftopsydney.com.au", bestFor:"Engagement parties, milestone birthdays, group celebrations" },
  { id:14, name:"Aqua Luna Waterfront", category:"waterfront", area:"Drummoyne", address:"461 Henley Marine Dr, Drummoyne NSW 2047", lat:-33.858, lng:151.159, rating:4.8, reviews:401, price:"$$$", style:"Waterfront event venue", palette:"Harbour blue, white, warm timber", colors:["#1B4F72","#FFFFFF","#DEB887","#2C3E50"], hasPrivateRoom:true, privateRoomNote:"Full venue for private events, harbour views", proposalScore:4, tags:["waterfront","harbour views","intimate functions","attentive"], capacity:"Multiple configurations", summary:"A waterfront dining and event venue on the Parramatta River. Known for intimate functions and exceptionally attentive coordination by Anna and Martina. Guests consistently praise the personal touch. The water views and smaller scale make it feel more personal than larger harbour venues.", phone:"+61 2 9719 2226", hours:"Mon–Fri 9 am – 5 pm", website:"aqualuna.com.au", bestFor:"Intimate waterfront celebrations, christenings, small private events" },
  { id:15, name:"Zest Waterfront Mosman", category:"waterfront", area:"Mosman", address:"237 Spit Rd, Mosman NSW 2088", lat:-33.806, lng:151.247, rating:4.7, reviews:406, price:"$$$$", style:"Premium harbourside venue", palette:"Ocean blue, white, natural timber", colors:["#1B4F72","#FFFFFF","#DEB887","#2E86C1"], hasPrivateRoom:true, privateRoomNote:"Full venue hire — ceremony and reception", proposalScore:5, tags:["harbour","premium","Mosman","full-service"], capacity:"Large events", summary:"Sister venue to the Point Piper location, set on the Spit Bridge harbourside. The same award-winning service team in a slightly different setting. Martin leads on-the-day coordination with calm professionalism. The boathouse charm combined with harbour views creates a relaxed yet polished atmosphere.", phone:"+61 2 9932 4644", hours:"Mon–Fri 9 am – 5 pm (events unrestricted)", website:"zestwaterfrontvenues.com.au", bestFor:"Premium waterfront celebrations, boathouse charm, north shore access" },
  // ── NEW VENUES ──
  { id:16, name:"Sails on Lavender Bay", category:"dining", area:"McMahons Point", address:"2 Henry Lawson Ave, McMahons Point NSW 2060", lat:-33.849, lng:151.206, rating:4.4, reviews:1350, price:"$$$$", style:"Waterfront fine dining, harbour panorama", palette:"Nautical white, harbour blue, sunset gold", colors:["#FFFFFF","#1B4F72","#C4A87C","#F5E6CA"], hasPrivateRoom:false, privateRoomNote:"Intimate waterfront tables with Harbour Bridge and Opera House views", proposalScore:5, tags:["harbour panorama","Harbour Bridge","Opera House","romantic","sunset"], capacity:"~60 seats", summary:"Directly on Lavender Bay with panoramic views of the Harbour Bridge, Opera House, and Luna Park. Accessible by boat — arrive by water taxi for maximum impact. Pink sunsets over the harbour provide a breathtaking backdrop. Staff are trained to support proposals discreetly.", phone:"+61 2 9955 5998", hours:"Daily lunch + dinner", website:"sailslavenderbay.com.au", bestFor:"Waterfront proposals with triple-landmark views, water taxi arrival" },
  { id:17, name:"Aria Restaurant", category:"dining", area:"Circular Quay", address:"1 Macquarie St, Sydney NSW 2000", lat:-33.859, lng:151.213, rating:4.5, reviews:2386, price:"$$$$", style:"Two-hatted modern Australian fine dining", palette:"Warm neutral, harbour light, polished timber", colors:["#F5F0E8","#2C3E50","#C4A87C","#DEB887"], hasPrivateRoom:true, privateRoomNote:"Private dining room and chef's table available", proposalScore:5, tags:["two-hatted","harbour view","fine dining","chef's table","Circular Quay"], capacity:"~90 seats + private room", summary:"A two-hatted restaurant at the edge of the harbour with Opera House views. Private dining room and chef's table available for intimate celebrations. Known for exceptional mains and souffles. Staff celebrate special occasions with a candle and cupcake — discreet but personal.", phone:"+61 2 9240 2255", hours:"Mon–Sun dinner; Thu–Sun lunch", website:"ariarestaurant.com.au", bestFor:"Fine dining proposals, private chef's table, harbour backdrop" },
  { id:18, name:"Oborozuki", category:"dining", area:"CBD", address:"Level 3/71 Macquarie St, Sydney NSW 2000", lat:-33.861, lng:151.213, rating:4.8, reviews:440, price:"$$$$", style:"Three-hat-worthy modern Japanese", palette:"Deep charcoal, natural wood, moonlight", colors:["#1A1A1A","#D4C5A9","#2C2C2C","#F5F0E8"], hasPrivateRoom:false, privateRoomNote:"Intimate setting, teppanyaki counter available", proposalScore:4, tags:["Japanese","tasting menu","refined","quiet","harbour glimpse"], capacity:"~35 seats", summary:"Hidden on level 3 of a Macquarie Street building. Modern Japanese with creativity and precision that reviewers compare to three-hat quality. The signature toothfish arrives in a smoky box for a theatrical reveal. Quiet enough for whispered conversations, refined enough for life-changing moments.", phone:"+61 426 111 999", hours:"Tue–Sat dinner; Fri–Sat lunch", website:"oborozuki.com.au", bestFor:"Foodie proposals, theatrical dining, quiet refined atmosphere" },
  { id:19, name:"Aalia", category:"dining", area:"CBD", address:"Shop 7.07/25 Martin Pl, Sydney NSW 2000", lat:-33.868, lng:151.209, rating:4.7, reviews:1154, price:"$$$", style:"Two-hatted Middle Eastern fine dining", palette:"Terracotta, brass, warm amber", colors:["#CD853F","#B8860B","#2C1810","#F5E6CA"], hasPrivateRoom:true, privateRoomNote:"Semi-private alcoves and group dining areas", proposalScore:4, tags:["Middle Eastern","two-hatted","Martin Place","atmospheric","exotic"], capacity:"~80 seats", summary:"A two-hatted Middle Eastern restaurant beneath Martin Place. Rich terracotta tones and brass details create an atmospheric, almost transportive setting. Outstanding oysters and lamb. Group dining areas suit intimate celebrations with a sense of occasion.", phone:"+61 2 9182 5880", hours:"Mon–Fri lunch + dinner; Sat dinner", website:"aaliarestaurant.com.au", bestFor:"Atmospheric dining, Middle Eastern cuisine lovers, Martin Place location" },
  { id:20, name:"Sala / Suite Two", category:"dining", area:"Pyrmont", address:"26-32 Pirrama Rd, Pyrmont NSW 2009", lat:-33.863, lng:151.195, rating:4.6, reviews:396, price:"$$$", style:"Italian waterfront with private wedding space", palette:"Mediterranean blue, white, warm timber", colors:["#1B4F72","#FFFFFF","#DEB887","#C4A87C"], hasPrivateRoom:true, privateRoomNote:"Suite Two — dedicated private event space for weddings and celebrations", proposalScore:4, tags:["Italian","waterfront","Pyrmont","private events","Jones Bay Wharf"], capacity:"Restaurant ~70 + Suite Two ~80", summary:"An Italian waterfront restaurant at Jones Bay Wharf with a dedicated private event space called Suite Two. The venue handles ceremony, cocktail hour, and reception in one waterfront location. Claire manages events with faultless coordination.", phone:"+61 2 8379 8988", hours:"Wed–Sat lunch + dinner; Sun lunch", website:"saladining.com.au", bestFor:"Waterfront Italian dining, private celebrations via Suite Two" },
  { id:21, name:"Bathers' Pavilion", category:"dining", area:"Mosman", address:"4 The Esplanade, Mosman NSW 2088", lat:-33.822, lng:151.251, rating:4.3, reviews:2330, price:"$$$", style:"Heritage beachside restaurant + event venue", palette:"Coastal white, sandstone, sea blue", colors:["#F5F0E8","#C2B280","#1B4F72","#DEB887"], hasPrivateRoom:true, privateRoomNote:"Private dining room and full venue hire for events", proposalScore:4, tags:["beachside","Balmoral","heritage","fine dining","sunset"], capacity:"~100 seats + event spaces", summary:"A heritage building on Balmoral Beach with over 20 years of fine dining history. The art collection and sunset views create a uniquely cultured atmosphere. The bistro is relaxed; the restaurant is refined. Both work for proposals depending on the energy you want.", phone:"+61 2 9969 5050", hours:"Daily 8 am – 10 pm", website:"batherspavilion.com.au", bestFor:"Beachside proposals, Balmoral sunset dining, cultured atmosphere" },
  { id:22, name:"Gunners Barracks", category:"waterfront", area:"Mosman", address:"Suakin Dr, Mosman NSW 2088", lat:-33.837, lng:151.258, rating:4.7, reviews:1562, price:"$$", style:"Heritage harbourside tearoom + event venue", palette:"Sandstone, military green, harbour blue", colors:["#C2B280","#355E3B","#1B4F72","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Multiple event spaces — intimate to 200 guests", proposalScore:4, tags:["heritage","harbourside","high tea","wedding venue","Mosman"], capacity:"20–200", summary:"A heritage military building on the harbour at Chowder Bay. Famous for high tea and wedding events. Multiple spaces from intimate rooms to grand halls. Holly and the events team coordinate with precision. The sandstone architecture and harbour views photograph beautifully.", phone:"+61 2 8962 5900", hours:"Daily 10 am – 5 pm", website:"gunnersbarracks.com.au", bestFor:"High tea proposals, heritage wedding receptions, harbourside celebrations" },
  { id:23, name:"Sergeants Mess", category:"waterfront", area:"Mosman", address:"Chowder Bay Rd, Mosman NSW 2088", lat:-33.838, lng:151.258, rating:4.6, reviews:805, price:"$$$", style:"Harbourside heritage event venue", palette:"Sandstone, navy, harbour grey", colors:["#C2B280","#1B3A4B","#8B8682","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Exclusive venue hire with harbour terrace", proposalScore:4, tags:["harbourside","heritage","Chowder Bay","exclusive","waterfront terrace"], capacity:"Up to 200", summary:"Adjacent to Gunners Barracks at Chowder Bay. A purpose-built event venue with direct harbour access and a waterfront terrace. The food consistently receives praise. Private and exclusive — no shared spaces during your event.", phone:"+61 2 8978 9200", hours:"Daily 9 am – 5 pm", website:"sergeantsmess.com.au", bestFor:"Exclusive harbourside events, wedding receptions, private celebrations" },
  { id:24, name:"Yallamundi Rooms", category:"waterfront", area:"Circular Quay", address:"Sydney Opera House, Sydney NSW 2000", lat:-33.856, lng:151.216, rating:4.7, reviews:22, price:"$$$$", style:"Modern event space at the Opera House", palette:"Clean white, glass, harbour light", colors:["#FFFFFF","#2C3E50","#C4A87C","#F5F0E8"], hasPrivateRoom:true, privateRoomNote:"Full venue hire — floor-to-ceiling harbour views", proposalScore:5, tags:["Opera House","harbour","modern","iconic","floor-to-ceiling glass"], capacity:"Up to 200", summary:"A modern glass-walled event space at the base of the Opera House. Floor-to-ceiling harbour views with the Harbour Bridge as backdrop. Step outside for couple portraits in front of the sails. Paula coordinates with impressive speed and professionalism.", phone:"+61 2 9250 7111", hours:"By event booking", website:"sydneyoperahouse.com", bestFor:"Iconic Opera House events, harbour-view receptions, statement celebrations" },
  { id:25, name:"Four Seasons Hotel Sydney", category:"hotel", area:"The Rocks", address:"199 George St, The Rocks NSW 2000", lat:-33.862, lng:151.208, rating:4.8, reviews:9, price:"$$$$", style:"Luxury hotel ballroom + harbour suites", palette:"Gold, cream, crystal chandelier", colors:["#C5B358","#FFF8F0","#2C2C2C","#F5E6CA"], hasPrivateRoom:true, privateRoomNote:"Grand ballroom with wall-to-wall screens + harbour suites", proposalScore:5, tags:["luxury hotel","ballroom","The Rocks","five-star","harbour suite"], capacity:"Ballroom 300+", summary:"The grand ballroom features wall-to-wall screens that transform the space for each event. Ron and Tehya coordinate with 110% dedication. Harbour-view suites available for overnight stays — propose at dinner, wake up to the harbour. Taste testing sessions included in wedding packages.", phone:"+61 3 9250 3124", hours:"Daily 9 am – 12 am", website:"fourseasons.com/sydney", bestFor:"Luxury hotel proposals, grand ballroom weddings, harbour suite stays" },
  { id:26, name:"Gledswood Homestead & Winery", category:"winery", area:"Catherine Field", address:"900 Camden Valley Wy, Catherine Field NSW 2557", lat:-34.005, lng:150.784, rating:4.3, reviews:423, price:"$$", style:"Heritage homestead and winery since 1810", palette:"Rustic gold, vineyard green, aged timber", colors:["#8B7355","#4A7C59","#DEB887","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Multiple spaces — Cask Room (80 guests), gardens, homestead", proposalScore:3, tags:["winery","heritage","rustic","1810","farm animals","country"], capacity:"80–200", summary:"A heritage property dating to 1810 with 50 acres of grounds. The Cask Room provides an intimate reception space for 80 guests. Quirky touches include farm animals and a historic cellar. Best for couples wanting rustic country character outside the city.", phone:"+61 2 9606 5111", hours:"Tue–Sat 9 am – 5 pm", website:"gledswood.com.au", bestFor:"Rustic country weddings, winery celebrations, heritage homestead events" },
  { id:27, name:"Dryridge Estate", category:"winery", area:"Blue Mountains", address:"226 Aspinall Rd, Megalong Valley NSW 2785", lat:-33.735, lng:150.219, rating:4.9, reviews:435, price:"$$", style:"Blue Mountains vineyard with valley views", palette:"Mountain green, vineyard gold, stone grey", colors:["#355E3B","#C5B358","#8B8682","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Entire estate hire, lodge accommodation", proposalScore:5, tags:["Blue Mountains","vineyard","valley views","lodge","escape"], capacity:"Intimate (up to ~40)", summary:"A vineyard estate in Megalong Valley with sweeping mountain views. Emma hosts with warmth. The ploughman's platter paired with estate wines is the signature experience. Lodge accommodation available for overnight stays. The drive through the Blue Mountains adds to the sense of escape and occasion.", phone:"+61 403 118 990", hours:"Sat 11 am – 5 pm; Sun 11 am – 4 pm", website:"dryridgeestate.com.au", bestFor:"Blue Mountains escape proposals, vineyard weekends, intimate celebrations" },
  { id:28, name:"Oatlands Estate", category:"garden", area:"Oatlands", address:"42 Bettington Rd, Oatlands NSW 2117", lat:-33.795, lng:151.030, rating:4.4, reviews:578, price:"$$", style:"Heritage garden estate with multiple event spaces", palette:"Garden green, heritage cream, warm terracotta", colors:["#4A7C59","#FFF8F0","#CD853F","#8B7355"], hasPrivateRoom:true, privateRoomNote:"Multiple indoor/outdoor spaces for 50–500 guests", proposalScore:3, tags:["heritage","garden","flexible sizes","affordable","western Sydney"], capacity:"50–500", summary:"A heritage estate with beautiful gardens and versatile event spaces. Sophia, Kiara, and the team provide responsive, personal coordination. Moderate pricing makes it accessible for larger celebrations. Easy parking and central western Sydney location.", phone:"+61 2 9683 3355", hours:"Daily 9 am – 5:30 pm", website:"oatlandsestate.com.au", bestFor:"Affordable garden events, large celebrations, western Sydney access" },
  { id:29, name:"Estate Vaucluse House", category:"dining", area:"Vaucluse", address:"69A Wentworth Rd, Vaucluse NSW 2030", lat:-33.855, lng:151.273, rating:4.5, reviews:91, price:"$$$", style:"Heritage mansion dining + wedding venue", palette:"Heritage cream, garden green, sandstone", colors:["#FFF8F0","#4A7C59","#C2B280","#DEB887"], hasPrivateRoom:true, privateRoomNote:"Full venue hire for weddings and private events", proposalScore:4, tags:["heritage mansion","Vaucluse","garden","high tea","Eastern Suburbs"], capacity:"Event hire flexible", summary:"A restaurant within the grounds of the heritage-listed Vaucluse House. Asian fusion meets Western cuisine. Daniel coordinates weddings with seamless communication. Bottomless high tea available for celebratory occasions. The heritage gardens provide stunning photography backdrops.", phone:"+61 2 9388 8188", hours:"Wed–Fri lunch; Sat–Sun brunch+lunch", website:"estatevauclusehouse.com.au", bestFor:"Heritage garden proposals, high tea celebrations, Eastern Suburbs elegance" },
  { id:30, name:"The Surry Rooftop", category:"rooftop", area:"Surry Hills", address:"Level 11/28 Albion St, Surry Hills NSW 2010", lat:-33.882, lng:151.210, rating:4.7, reviews:22, price:"$$", style:"Modern rooftop event venue", palette:"Urban grey, white, city lights", colors:["#2C2C2C","#FFFFFF","#C4A87C","#1A1A2E"], hasPrivateRoom:true, privateRoomNote:"Full rooftop venue hire with city views", proposalScore:3, tags:["rooftop","Surry Hills","city views","modern","affordable"], capacity:"Up to 150", summary:"A modern rooftop venue on level 11 with city skyline views. Nancy coordinates events with thorough, responsive communication. Ceremony and reception in one location. More affordable than harbour-view rooftops with a contemporary urban feel.", phone:"+61 2 9289 0000", hours:"Daily 9 am – 11 pm", website:"", bestFor:"Affordable rooftop events, Surry Hills location, city skyline backdrop" },
  { id:31, name:"Horizons Maroubra", category:"waterfront", area:"Maroubra", address:"1R Marine Parade, Maroubra NSW 2035", lat:-33.951, lng:151.256, rating:4.6, reviews:91, price:"$$", style:"Beachfront event venue", palette:"Ocean blue, sandy neutral, sunset warm", colors:["#1B4F72","#DEB887","#C4A87C","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Full venue hire with beachfront terrace", proposalScore:4, tags:["beachfront","Maroubra","affordable","LGBTQIA+ friendly","modern"], capacity:"Up to 150", summary:"A beachfront event venue at Maroubra with ocean views and a modern terrace. Jenna coordinates with warmth and efficiency. LGBTQIA+ friendly — explicitly welcoming to all couples. Surprisingly affordable for a beachfront location. Vendor recommendations included.", phone:"+61 418 862 666", hours:"Daily 9 am – late", website:"", bestFor:"Beachfront celebrations, affordable ocean views, inclusive venue" },
  { id:32, name:"The Blue Room Bondi", category:"waterfront", area:"Bondi Beach", address:"Queen Elizabeth Dr, Bondi Beach NSW 2026", lat:-33.890, lng:151.278, rating:4.8, reviews:59, price:"$$$", style:"Iconic Bondi Beach function room", palette:"Ocean blue, Bondi white, sunset gold", colors:["#1B4F72","#FFFFFF","#C5B358","#F5E6CA"], hasPrivateRoom:true, privateRoomNote:"Upstairs function room with arched windows framing Bondi Beach", proposalScore:5, tags:["Bondi Beach","iconic","arched windows","ocean view","function room"], capacity:"Up to 120", summary:"An iconic function room above Bondi Beach with arched windows that perfectly frame the ocean. The sunset view through those arches is one of Sydney's most photographed backdrops. Bridal high teas and intimate receptions. You cannot find a venue with a better beach view in Sydney.", phone:"", hours:"By event booking", website:"", bestFor:"Bondi Beach backdrop proposals, ocean-view receptions, iconic Sydney setting" },
  { id:33, name:"Lindesay", category:"garden", area:"Darling Point", address:"1 Carthona Ave, Darling Point NSW 2027", lat:-33.868, lng:151.240, rating:4.7, reviews:40, price:"$$", style:"Heritage mansion with harbour garden", palette:"Heritage cream, garden green, harbour blue", colors:["#FFF8F0","#355E3B","#1B4F72","#C2B280"], hasPrivateRoom:true, privateRoomNote:"Entire heritage property — only 10 weddings per year", proposalScore:5, tags:["heritage mansion","Darling Point","exclusive","harbour garden","limited availability"], capacity:"Intimate (up to ~80)", summary:"A heritage mansion at Darling Point with harbour views from the garden. Only 10 weddings permitted per year — extraordinary exclusivity. BYO catering gives creative freedom. The garden and harbour backdrop feel like a private estate within the city.", phone:"+61 2 9363 2401", hours:"By appointment", website:"", bestFor:"Ultra-exclusive proposals, heritage garden ceremonies, limited-availability prestige" },
  { id:34, name:"Handpicked Wines Cellar Door", category:"winery", area:"CBD", address:"203 Castlereagh St, Sydney NSW 2000", lat:-33.874, lng:151.209, rating:4.5, reviews:272, price:"$$", style:"Urban wine bar + private event space", palette:"Wine burgundy, dark timber, warm amber", colors:["#722F37","#2C1810","#C4A87C","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Private tasting rooms and event hire", proposalScore:3, tags:["wine bar","CBD","tasting flights","intimate","urban winery"], capacity:"~60", summary:"An urban cellar door in the CBD offering wine tasting flights with cheese pairings. Private tasting rooms available for intimate celebrations. A low-key, sophisticated option for wine-loving couples who want to stay in the city. Propose over a flight of pinot noir.", phone:"+61 2 8236 8855", hours:"Daily 7 am – 10 pm", website:"handpickedwines.com.au", bestFor:"Wine-lover proposals, CBD tasting experiences, intimate celebrations" },
  { id:35, name:"Rotunda at Balmoral Beach", category:"garden", area:"Mosman", address:"63 The Esplanade, Mosman NSW 2088", lat:-33.823, lng:151.251, rating:4.6, reviews:161, price:"Free (permit)", style:"Heritage rotunda on Balmoral Beach", palette:"Sandstone, coastal blue, park green", colors:["#C2B280","#1B4F72","#4A7C59","#FFF8F0"], hasPrivateRoom:false, privateRoomNote:"Open-air rotunda — ceremony permit required from Mosman Council", proposalScore:5, tags:["beach rotunda","Balmoral","free entry","outdoor ceremony","heritage"], capacity:"Outdoor flexible", summary:"A 1930s heritage rotunda overlooking Balmoral Beach. One of Sydney's most popular proposal spots — the combination of harbour water, parkland, and the elegant rotunda creates a naturally romantic setting. Free to visit, ceremony permits through Mosman Council.", phone:"+61 2 9932 4502", hours:"Open air — daylight hours", website:"", bestFor:"Beach proposals, outdoor ceremonies, free romantic setting" },
  // ── BUDGET-FRIENDLY ($–$$) ──
  { id:36, name:"Lauriston House", category:"garden", area:"Dundas Valley", address:"146 Marsden Rd, Dundas Valley NSW 2117", lat:-33.796, lng:151.065, rating:4.6, reviews:460, price:"$$", style:"Enchanted garden estate with night lighting", palette:"Garden green, fairy light gold, evening purple", colors:["#355E3B","#C5B358","#2C1810","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Full venue — ceremony garden + reception hall + lit dance floor", proposalScore:4, tags:["garden","fairy lights","affordable","night magic","dance floor"], capacity:"Up to 200", summary:"A garden estate that transforms after dark — reviewers consistently describe it as 'a million times more magical at night.' Victoria responds to enquiries at 2am. Chriso coordinates every detail. The lit dance floor and fairy-light gardens create an affordable enchanted-forest feel.", phone:"+61 2 9858 3335", hours:"Mon–Thu 10am–5pm; Fri–Sun 24hrs", website:"", bestFor:"Affordable enchanted garden events, night-time celebrations" },
  { id:37, name:"Cropley House", category:"garden", area:"Baulkham Hills", address:"84 Watkins Rd, Baulkham Hills NSW 2153", lat:-33.769, lng:150.985, rating:4.5, reviews:231, price:"$$", style:"Restored 1920s heritage with manicured gardens", palette:"Heritage cream, garden green, warm timber", colors:["#FFF8F0","#4A7C59","#8B7355","#DEB887"], hasPrivateRoom:true, privateRoomNote:"Dual-level function spaces + outdoor ceremony gardens", proposalScore:3, tags:["1920s heritage","gardens","dual-level","affordable","western Sydney"], capacity:"Up to 250", summary:"A beautifully restored 1920s building with manicured gardens. Zabi coordinates with exceptional responsiveness. Dual-level spaces suit everything from intimate engagements to large weddings. Photographers specifically praise the natural light and architectural backdrops.", phone:"+61 2 8218 8805", hours:"By appointment", website:"", bestFor:"Affordable heritage events, large celebrations, photogenic gardens" },
  { id:38, name:"The Grand Vaudeville", category:"garden", area:"Condell Park", address:"178 Eldridge Rd, Condell Park NSW 2200", lat:-33.933, lng:151.007, rating:4.9, reviews:239, price:"$$", style:"Grand reception with mirror foyer", palette:"Gold, black, crystal", colors:["#C5B358","#1A1A1A","#FFF8F0","#2C2C2C"], hasPrivateRoom:true, privateRoomNote:"Grand reception hall with foyer mirror wall", proposalScore:4, tags:["grand","mirror foyer","affordable luxury","reception hall","south-west"], capacity:"Up to 300", summary:"4.9 rating with 239 reviews. Jasmine and Bash create an environment of genuine care. The signature mirror wall in the foyer is the selfie spot before every event. Grand without being expensive — reviewers describe it as 'affordable luxury.'", phone:"+61 2 8766 3133", hours:"Tue–Sat 10am–5pm", website:"", bestFor:"Affordable grand events, large weddings, statement reception hall" },
  { id:39, name:"Eden Venues", category:"garden", area:"Edensor Park", address:"673 Smithfield Rd, Edensor Park NSW 2176", lat:-33.883, lng:150.888, rating:4.5, reviews:621, price:"$$", style:"Large reception venue with full catering", palette:"Warm gold, cream, burgundy", colors:["#C5B358","#FFF8F0","#722F37","#2C1810"], hasPrivateRoom:true, privateRoomNote:"Multiple halls for 100–500 guests", proposalScore:3, tags:["large capacity","affordable","south-west Sydney","full catering","multicultural"], capacity:"100–500", summary:"A well-established large-scale reception venue in south-west Sydney. Teresa coordinates with professionalism and warmth. Known for exceptional food quality and attentive wait staff. Barista-made coffee at the end of the night is a standout touch.", phone:"+61 2 9823 4444", hours:"Daily 10am–6pm", website:"", bestFor:"Large affordable celebrations, multicultural weddings, 200+ guest events" },
  { id:40, name:"Clarence House", category:"garden", area:"Belmore", address:"454 Burwood Rd, Belmore NSW 2192", lat:-33.921, lng:151.090, rating:4.5, reviews:405, price:"$$", style:"Classic Victorian reception venue", palette:"Victorian cream, crystal, burgundy", colors:["#FFF8F0","#C5B358","#722F37","#8B7355"], hasPrivateRoom:true, privateRoomNote:"Victorian Room (intimate) + Grand Hall (large)", proposalScore:3, tags:["Victorian","classic","affordable","inner-west","multiple rooms"], capacity:"50–350", summary:"A classic reception venue with multiple rooms — the intimate Victorian Room suits smaller celebrations while the Grand Hall handles up to 350 guests. Steve and Chrissie coordinate with care. Reviewers describe being 'pleasantly surprised' by how affordable it is given the stunning interiors.", phone:"+61 2 9750 3555", hours:"Mon–Sun 10am–6pm", website:"", bestFor:"Classic affordable receptions, flexible room sizes, inner-west location" },
  { id:41, name:"Will & Mike's", category:"garden", area:"Banksmeadow", address:"14A Baker St, Banksmeadow NSW 2019", lat:-33.946, lng:151.212, rating:4.6, reviews:134, price:"$", style:"Casual garden cafe + event space", palette:"Garden green, rustic timber, warm white", colors:["#4A7C59","#8B7355","#FFF8F0","#DEB887"], hasPrivateRoom:true, privateRoomNote:"Garden + indoor space for casual celebrations", proposalScore:3, tags:["casual","garden","budget","cafe","family-friendly"], capacity:"Up to 100", summary:"The most budget-friendly venue on our list. A garden cafe that doubles as a warm, casual event space. Will personally helps with every step. Perfect for couples who want relaxed, unpretentious celebrations where guests can wander between indoor and outdoor spaces.", phone:"+61 2 9666 8855", hours:"Mon–Fri 7am–2:30pm; events by arrangement", website:"", bestFor:"Budget casual celebrations, relaxed garden parties, family-friendly events" },
  // ── MID-RANGE ($$$) ──
  { id:42, name:"The Eveleigh", category:"dining", area:"Eveleigh", address:"Bay 3/2 Locomotive St, Eveleigh NSW 2015", lat:-33.895, lng:151.196, rating:4.4, reviews:87, price:"$$$", style:"Industrial-chic heritage event space", palette:"Exposed brick, steel grey, warm amber", colors:["#8B7355","#8B8682","#C4A87C","#2C1810"], hasPrivateRoom:true, privateRoomNote:"Main hall + mezzanine + courtyard, by The Grounds team", proposalScore:4, tags:["industrial chic","heritage","The Grounds","exposed brick","Eveleigh"], capacity:"Up to 250", summary:"An industrial-chic heritage space run by The Grounds of Alexandria team. High ceilings, exposed brickwork, and a mezzanine create dramatic atmosphere. The courtyard adds an outdoor element. A favourite of photographers for its architectural character.", phone:"+61 2 9699 2225", hours:"Mon–Sat 7am–12am", website:"", bestFor:"Industrial-chic celebrations, photographer-friendly architecture" },
  { id:43, name:"Doltone House Hyde Park", category:"waterfront", area:"CBD", address:"3/181 Elizabeth St, Sydney NSW 2000", lat:-33.872, lng:151.210, rating:4.4, reviews:538, price:"$$$", style:"Luxury event space overlooking Hyde Park", palette:"Crystal chandelier, black suede, gold", colors:["#C5B358","#1A1A1A","#FFF8F0","#2C2C2C"], hasPrivateRoom:true, privateRoomNote:"Multiple grand rooms with Hyde Park views and large screens", proposalScore:4, tags:["luxury events","Hyde Park","chandeliers","large screens","grand"], capacity:"Up to 500", summary:"A luxury event venue with Hyde Park views, crystal chandeliers, and wall-to-wall screens. Part of the Signorelli Group with decades of experience. Bianca and Paul coordinate large-scale events with precision. Multiple rooms for different event sizes.", phone:"+61 2 8571 0622", hours:"By event booking", website:"doltonehouse.com.au", bestFor:"Large-scale grand events, corporate + wedding, Hyde Park setting" },
  { id:44, name:"Glass Island", category:"waterfront", area:"Darling Harbour", address:"Wharf 1/Pier 26, 7 Wheat Rd, Sydney NSW 2000", lat:-33.871, lng:151.203, rating:4.1, reviews:196, price:"$$$", style:"Floating glass venue on Sydney Harbour", palette:"Harbour blue, glass, night lights", colors:["#1B4F72","#FFFFFF","#1A1A2E","#C5B358"], hasPrivateRoom:true, privateRoomNote:"Entire floating venue — private hire available", proposalScore:4, tags:["floating","harbour cruise","glass walls","unique","Darling Harbour"], capacity:"Up to 200", summary:"A floating glass-walled venue that cruises Sydney Harbour. Views of the Opera House, Harbour Bridge, and city skyline from water level. Available for private hire — propose as you glide past the Opera House at sunset. Weekend fireworks visible from the water.", phone:"+61 2 8246 7248", hours:"Fri 7–11pm; Sat–Sun sessions", website:"", bestFor:"Harbour cruise proposals, floating celebrations, unique venue experience" },
  // ── HIGH-END ($$$$) ──
  { id:45, name:"Lana", category:"dining", area:"CBD", address:"Level 1/5-7 Young St, Sydney NSW 2000", lat:-33.863, lng:151.211, rating:4.6, reviews:1097, price:"$$$$", style:"Hidden fine dining through a secret entrance", palette:"Deep burgundy, warm gold, dark timber", colors:["#722F37","#C5B358","#2C1810","#FFF8F0"], hasPrivateRoom:true, privateRoomNote:"Private event hire available through the main space", proposalScore:5, tags:["hidden entrance","secret door","fine dining","exclusive","CBD"], capacity:"~80 seats", summary:"Enter through another restaurant's door and walk through to discover Lana — a hidden fine dining destination. The secret entrance adds theatrical flair to a proposal. Italian-Asian fusion with theatrical presentation. Reviewers describe feeling like they've 'discovered somewhere exclusive.'", phone:"+61 2 7228 1400", hours:"Mon–Sat dinner; Thu–Fri lunch", website:"", bestFor:"Theatrical secret-entrance proposals, exclusive fine dining" },
  { id:46, name:"The Gidley", category:"dining", area:"CBD", address:"Basement/161 King St, Sydney NSW 2000", lat:-33.869, lng:151.210, rating:4.6, reviews:1367, price:"$$$", style:"Subterranean steakhouse with phone lockaway", palette:"Dark leather, warm timber, brass", colors:["#2C1810","#8B7355","#B8860B","#1A1A1A"], hasPrivateRoom:true, privateRoomNote:"The Library — private poker room with drink service", proposalScore:5, tags:["subterranean","no-phones","steakhouse","The Library","poker room"], capacity:"~60 seats + The Library", summary:"BISTECCA's sister venue — another subterranean steakhouse where phones are locked away. The Library is a private room with poker tables and dedicated drink service. The charcoal-grilled spinalis is legendary. Like BISTECCA, the no-phone policy forces genuine presence.", phone:"+61 2 9169 6898", hours:"Daily 12pm–12am", website:"", bestFor:"Private Library proposals, no-phone intimate dining, charcoal steakhouse" },
  { id:47, name:"O Bar and Dining", category:"dining", area:"CBD", address:"Level 47/264 George St, Sydney NSW 2000", lat:-33.865, lng:151.208, rating:4.4, reviews:5296, price:"$$$$", style:"Revolving restaurant on level 47", palette:"Night sky, city lights, crystal", colors:["#1A1A2E","#C5B358","#FFFFFF","#0F3460"], hasPrivateRoom:false, privateRoomNote:"Request the Gold Experience table closest to the view", proposalScore:5, tags:["revolving","level 47","360 panorama","skyline","romantic"], capacity:"~80 seats", summary:"A revolving restaurant on level 47 with 360-degree views of Sydney. The floor rotates slowly so every seat gets every view. The Gold Experience seats you closest to the windows. Propose as the Opera House drifts into view. Staff discreetly support special occasions with personalised cards.", phone:"+61 2 9247 9777", hours:"Mon–Sun dinner; Fri–Sat lunch", website:"", bestFor:"Sky-high proposals, revolving panorama, once-in-a-lifetime views" },
  { id:48, name:"Bentley Restaurant + Bar", category:"dining", area:"CBD", address:"27 O'Connell St, Sydney NSW 2000", lat:-33.866, lng:151.209, rating:4.4, reviews:912, price:"$$$$", style:"Hatted modern Australian, culinary theatre", palette:"Dark moody, native botanicals, candlelight", colors:["#1A1A1A","#4A6741","#C4A87C","#2C2C2C"], hasPrivateRoom:false, privateRoomNote:"Intimate setting, dim lighting, best tables by window", proposalScore:4, tags:["hatted","native ingredients","culinary art","CBD","intimate"], capacity:"~50 seats", summary:"A hatted restaurant where every dish arrives as art. Australian native ingredients used in unexpected combinations. The dim, intimate atmosphere and bold flavours create a sense of occasion. Best for food-obsessed couples who want the proposal dinner to be as memorable as the question.", phone:"+61 2 8214 0505", hours:"Tue–Sat dinner; Thu–Fri lunch", website:"", bestFor:"Culinary art proposals, native Australian fine dining, foodie couples" },
  { id:49, name:"NOUR", category:"dining", area:"Surry Hills", address:"3/490 Crown St, Surry Hills NSW 2010", lat:-33.887, lng:151.214, rating:4.8, reviews:3287, price:"$$$", style:"Hatted Middle Eastern with open kitchen", palette:"Warm terracotta, copper, candlelight", colors:["#CD853F","#B8860B","#2C1810","#FFF8F0"], hasPrivateRoom:false, privateRoomNote:"Kitchen counter seating for up-close chef experience", proposalScore:4, tags:["Middle Eastern","hatted","open kitchen","Surry Hills","atmospheric"], capacity:"~70 seats", summary:"Sydney's highest-rated Middle Eastern restaurant — 4.8 stars across 3,287 reviews. The kitchen counter puts you face-to-face with masterful chefs. The woodfired coconut basbousa dessert alone is worth the visit. Carter, Arthur, and the team celebrate occasions with genuine warmth.", phone:"+61 2 9331 3413", hours:"Daily dinner; Thu–Sun lunch", website:"", bestFor:"Atmospheric dining proposals, open kitchen experience, Surry Hills" },
  { id:50, name:"Infinity at Sydney Tower", category:"dining", area:"CBD", address:"Level 4/108 Market St, Sydney NSW 2000", lat:-33.870, lng:151.209, rating:4.5, reviews:3883, price:"$$$$", style:"Fine dining at Sydney's highest point", palette:"Gold, city glow, evening sky", colors:["#C5B358","#1A1A2E","#FFFFFF","#2C3E50"], hasPrivateRoom:false, privateRoomNote:"Request table facing Opera House direction", proposalScore:5, tags:["Sydney Tower","highest restaurant","panoramic","CBD","fine dining"], capacity:"~80 seats", summary:"Fine dining at the highest point in Sydney's CBD. Chef Mark Best's creativity with Australian produce is celebrated across every course. Valentine's Day roses, anniversary celebrations with personalised touches — the staff make special occasions feel genuinely special. Sandro and Mattia provide exceptional service.", phone:"", hours:"Daily lunch", website:"", bestFor:"Sky-high proposals, highest restaurant in CBD, panoramic fine dining" },
];

const PLANNERS = [
  { id:101, name:"Knighted Moments Sydney", type:"Proposal specialist", area:"Georges Hall", address:"Oak Dr, Georges Hall NSW 2198", rating:5.0, reviews:10, services:"Proposal planning, romantic setups, surprise coordination, weather contingency planning", specialties:"Marriage proposals, romantic events", phone:"+61 450 270 339", hours:"Open 24 hours", people:"Tony", summary:"A specialist proposal planner. Tony personally handles location scouting, setup, and contingency plans for weather. Small operation focused exclusively on proposals — not weddings, not corporate, just proposals. Constant communication throughout the planning process. Multiple reviewers mention the setup exceeding expectations.", website:"", priceGuide:"Contact for quote", colors:["#8B0000","#FFD700","#1A1A1A","#FFF8F0"] },
  { id:102, name:"Upside Down Events", type:"Full-service planner + florist", area:"Croydon", address:"1/210-212 Elizabeth St, Croydon NSW 2132", rating:5.0, reviews:72, services:"Wedding planning, styling, florals, stationery, on-the-day coordination", specialties:"Weddings, destination weddings, floral design", phone:"", hours:"Mon–Fri 10 am – 5 pm", people:"Lilac, Amy, Rebecca", summary:"A highly rated full-service planner and florist led by Lilac. Known for creative, non-generic floral work — reviewers note their arrangements feel 'designed, not assembled.' They handle destination weddings and are experienced with complex, multi-vendor coordination. Amy and Rebecca support on-the-day logistics.", website:"upsidedownevents.com.au", priceGuide:"Packages from ~$3,000", colors:["#E8B4B8","#355E3B","#FFF8F0","#D4A574"] },
  { id:103, name:"STYLED by JUNO", type:"Wedding planner + designer", area:"Leichhardt", address:"10 Foster St, Leichhardt NSW 2040", rating:4.9, reviews:76, services:"Wedding planning, design concept development, styling, full coordination", specialties:"Weddings, cross-cultural celebrations (strong Chinese-Australian clientele)", phone:"", hours:"By appointment", people:"Juno", summary:"A designer-led planning studio where Juno personally develops each wedding's visual concept from mood boards. Strong reputation with Chinese-Australian couples who value both cultural sensitivity and contemporary design. Reviewers praise her patience through multiple venue changes and indecision — she stays calm and solution-focused. The design work is described as 'elegant and effortless.'", website:"styledbyjuno.com", priceGuide:"Contact for quote", colors:["#2C2C2C","#C5B358","#FFF8F0","#8B7355"] },
  { id:104, name:"Little Lane Events", type:"Planner + stylist", area:"Warriewood", address:"Unit 3/10 Prosperity Parade, Warriewood NSW 2102", rating:5.0, reviews:63, services:"Wedding planning, elopements, styling, coordination, champagne bar hire", specialties:"Elopements, intimate weddings, Northern Beaches events", phone:"+61 414 633 941", hours:"Mon–Fri 9 am – 5 pm", people:"Sigrid, Kirra, Lauren", summary:"A Northern Beaches team specialising in elopements and intimate weddings. Three planners who each bring personal attention — Sigrid is noted for 'thinking of everything so the couple doesn't have to.' They also offer champagne bar hire and manage the full event from start to finish. Ideal for couples who want personal, not corporate.", website:"littlelaneevents.com.au", priceGuide:"From ~$2,500", colors:["#F5E6CA","#4A7C59","#2D2D2D","#E8D5B7"] },
  { id:105, name:"Honey Lane", type:"Wedding planner + stylist", area:"North Manly", address:"2/410 Pittwater Rd, North Manly NSW 2100", rating:4.9, reviews:69, services:"Wedding planning, styling, vendor sourcing, on-the-day coordination", specialties:"Weddings (including Bali destinations), vendor network management", phone:"+61 499 393 000", hours:"Mon–Fri 9 am – 5 pm", people:"Lara, Sophie, Hannah, Emma, LJ", summary:"An established Northern Beaches team with a deep vendor network. Five team members each handling different specialities — Lara on overall planning, Sophie and Emma on vendor coordination, Hannah and LJ on styling. Known for making the planning process genuinely stress-free. Multiple reviewers describe their wedding as 'the most relaxed day' thanks to Honey Lane's preparation.", website:"honeylane.com.au", priceGuide:"From ~$4,000", colors:["#DEB887","#355E3B","#FFF8F0","#C4A87C"] },
  { id:106, name:"inLight Studios", type:"Lighting + theming specialist", area:"Botany", address:"29 Rochester St, Botany NSW 2019", rating:5.0, reviews:90, services:"Fairy lights, LED frames, cold sparks, event lighting, theming, photography", specialties:"Event lighting and ambiance, wedding atmospherics, corporate theming", phone:"+61 1300 855 688", hours:"Mon–Fri 9 am – 5:30 pm", people:"Dejana, Deep", summary:"The go-to specialist for lighting and atmospheric effects in Sydney. Fairy light canopies that transform venues, cold sparks for first dances, LED installations for corporate events. Also offers photography services. Dejana handles client communication with consistently praised responsiveness. They work well as a complement to any planner or venue.", website:"inlightstudios.com.au", priceGuide:"From ~$800 for lighting packages", colors:["#0F3460","#FFD700","#1A1A1A","#E94560"] },
  { id:107, name:"STYLED BY KC", type:"Event stylist", area:"Silverwater", address:"Unit 5/71-83 Asquith St, Silverwater NSW 2128", rating:5.0, reviews:55, services:"Wedding styling, corporate events, florals, backdrop design", specialties:"Wedding reception styling, budget-conscious design, corporate events", phone:"+61 409 524 473", hours:"Mon–Fri 9:30 am – 5 pm", people:"Lanny, KC", summary:"A budget-conscious stylist known for consistently over-delivering. Lanny works with couples to achieve their vision within financial constraints, then exceeds expectations on the day. Strong with floral centrepieces and backdrop design. Multiple reviewers use the phrase 'over-delivered' — a rare and telling pattern.", website:"styledbykc.com.au", priceGuide:"From ~$1,500", colors:["#C5B358","#FFF8F0","#8B4513","#355E3B"] },
  { id:108, name:"Sydney Events Stylist", type:"Event stylist", area:"Bronte", address:"30 Brae St, Bronte NSW 2024", rating:4.7, reviews:26, services:"Event styling, birthday parties, corporate events, short-notice setups", specialties:"Social events, birthdays, corporate, quick turnaround", phone:"+61 433 471 440", hours:"Daily 9 am – 5 pm", people:"Yael", summary:"A solo operator with strong creative vision based in the Eastern Suburbs. Yael is noted for fast turnaround — one reviewer describes a complete event setup with only two weeks' notice. Best suited for social events, birthday celebrations, and corporate functions rather than weddings.", website:"sydneyeventsstylist.com.au", priceGuide:"Contact for quote", colors:["#E8B4B8","#2C3E50","#FFF8F0","#C2B280"] },
  { id:109, name:"Symphony Events", type:"Full-service event stylist", area:"Blacktown", address:"Unit 7/40 Bessemer St, Blacktown NSW 2148", rating:4.9, reviews:162, services:"Wedding styling, fresh florals, mandap design, multicultural event design", specialties:"Multicultural weddings (Indian, Middle Eastern, Western), large-scale styling", phone:"+61 410 201 111", hours:"Daily 8 am – 7 pm", people:"Jackson, Jasmine, Karan, Aimee", summary:"A large, structured team specialising in multicultural wedding styling. Jackson leads with a consultative design process — mood boards, multiple revision rounds, and fresh flowers as standard. Strong track record with Indian, Middle Eastern, and Western ceremonies, often handling multi-day wedding events across different cultural traditions.", website:"symphonyevents.com.au", priceGuide:"From ~$3,000", colors:["#8B0000","#C5B358","#FFF8F0","#355E3B"] },
  { id:110, name:"Style Me Weddings & Events", type:"Wedding stylist + florist", area:"Villawood", address:"167 Woodville Rd, Villawood NSW 2163", rating:5.0, reviews:38, services:"Wedding styling, florals, centrepieces, sand wax candles, colour-matched design", specialties:"Wedding reception styling, floral artistry, colour-matched atmospherics", phone:"+61 449 258 199", hours:"By appointment", people:"Andy", summary:"A specialist in floral artistry and colour-matched reception design. Andy works from a single inspiration image to develop a full colour palette and atmospheric concept. Known for creative use of sand wax candles and precise colour tone matching. Multiple reviewers describe results that 'exceeded expectations on a budget.'", website:"", priceGuide:"Contact for quote", colors:["#E8B4B8","#C5B358","#2D5A27","#FFF8F0"] },
  // ── PHOTOGRAPHERS ──
  { id:201, name:"Sydney Proposal Photography", type:"Proposal photographer", area:"CBD", address:"281 Elizabeth St, Sydney NSW 2000", rating:5.0, reviews:24, services:"Proposal photography, couple shoots, engagement sessions", specialties:"Discreet surprise proposal capture, transparent pricing", phone:"+61 475 048 439", hours:"Flexible", people:"Frank", summary:"Frank specialises in proposal capture. Transparent packages published online, Zoom planning calls from overseas, flexible scheduling. Multiple reviewers note he goes beyond photography — helping plan logistics as if he were the best man.", website:"", priceGuide:"From ~$500", colors:["#2C3E50","#E8D5B7","#1A1A1A","#FFF8F0"] },
  { id:202, name:"Candid Chaser Photography", type:"Engagement photographer", area:"Rosebery", address:"5 Rosebery Ave, Rosebery NSW 2018", rating:5.0, reviews:130, services:"Engagement shoots, couples, pre-wedding, natural direction", specialties:"Candid natural style, pose direction for camera-shy couples", phone:"+61 481 465 074", hours:"Daily 6 am – 11 pm", people:"Ash", summary:"Ash excels at directing uncomfortable couples into natural poses. Reviewers describe feeling 'at ease' despite never taking photos before. Pre-wedding and engagement specialist with fast turnaround.", website:"", priceGuide:"Contact for quote", colors:["#D4A574","#2C2C2C","#FFF8F0","#8B7355"] },
  { id:203, name:"Sarah Iris Photography", type:"Proposal + family photographer", area:"Elizabeth Bay", address:"5/7 Esplanade, Elizabeth Bay NSW 2011", rating:5.0, reviews:51, services:"Proposal photography, family shoots, Sydney landmark sessions", specialties:"Discreet proposal capture at landmarks, pre-proposal planning calls", phone:"+61 408 141 798", hours:"Daily 7 am – 8 pm", people:"Sarah", summary:"Offers pre-proposal planning calls to coordinate timing and location. Discreet capture followed by a relaxed one-hour portrait session. Known for Sydney landmark photography at Opera House, Harbour Bridge, and beaches.", website:"", priceGuide:"Contact for quote", colors:["#E8B4B8","#2C3E50","#FFF8F0","#4A6741"] },
  { id:204, name:"Dreams Photography", type:"Wedding photographer", area:"The Rocks", address:"3 Hickson Rd, The Rocks NSW 2000", rating:5.0, reviews:35, services:"Wedding photography, events, relaxed direction", specialties:"Fun energy, makes couples comfortable, fast delivery", phone:"+61 400 532 124", hours:"24 hours", people:"John", summary:"John brings high energy and humour. Couples describe feeling like a 'princess.' Known for coordinating with other vendors and fast photo delivery.", website:"", priceGuide:"Contact for quote", colors:["#1A1A1A","#C4A87C","#FFF8F0","#2C3E50"] },
  { id:205, name:"Love is Light Photography", type:"Wedding photographer", area:"Drummoyne", address:"23 St Georges Cres, Drummoyne NSW 2047", rating:4.9, reviews:134, services:"Wedding photography, engagement shoots, family", specialties:"Warm approach, pre-learns guest faces via Zoom", phone:"+61 418 606 806", hours:"Daily 10 am – 8 pm", people:"Brendan", summary:"Brendan pre-learns important guest faces via Zoom before the wedding. Warm, communicative approach. 134 reviews praising his ability to make everyone feel valued and photographed.", website:"", priceGuide:"Contact for quote", colors:["#DEB887","#2C2C2C","#FFF8F0","#C2B280"] },
  // ── FLORISTS ──
  { id:301, name:"Lush Flower Co", type:"Premium florist", area:"Neutral Bay", address:"Shop 7&8/115 Military Rd, Neutral Bay NSW 2089", rating:5.0, reviews:654, services:"Bouquets, custom arrangements, plants, same-day delivery", specialties:"Premium North Shore florals, single rose to grand bouquets", phone:"+61 2 9030 4040", hours:"Mon–Sat 8:30 am – 5 pm; Sun 9 am – 5 pm", people:"Jack", summary:"5.0 rating with 654 reviews. Jack praised for old-fashioned personal service. Walk-in or phone orders. Single roses from $15 to grand arrangements.", website:"", priceGuide:"Single rose from $15", colors:["#E8B4B8","#355E3B","#FFF8F0","#8FBC8F"] },
  { id:302, name:"Best Buds Florist", type:"Wedding florist", area:"Chippendale", address:"130 Abercrombie St, Chippendale NSW 2008", rating:4.9, reviews:131, services:"Wedding florals (real + faux mix), bouquets, venue styling", specialties:"Budget-friendly wedding florals, real+faux flower mixing", phone:"+61 2 9310 1136", hours:"Mon–Fri 9 am – 3 pm", people:"Wendy", summary:"Wendy guides flower-clueless couples with patience. Known for reasonable wedding pricing and creative real+faux mixes that look indistinguishable. Bouquet wrapping service after ceremony.", website:"", priceGuide:"Reasonable (contact)", colors:["#E8B4B8","#4A7C59","#FFF8F0","#DEB887"] },
  { id:303, name:"Pearsons Florist", type:"Delivery florist", area:"Stanmore", address:"Unit 6/29 Bridge Rd, Stanmore NSW 2048", rating:4.9, reviews:833, services:"Online delivery, corporate, events, bouquets", specialties:"Interstate-friendly ordering, delivery tracking with photos", phone:"+61 1300 158 899", hours:"24 hours (online)", people:"Team", summary:"833 reviews. Strong delivery tracking — sends photo confirmation of arrangement and doorstep placement. Popular for interstate orders to Sydney recipients.", website:"pearsonsflorist.com.au", priceGuide:"Bouquets from ~$70", colors:["#C5B358","#355E3B","#FFF8F0","#E8B4B8"] },
  { id:304, name:"Flowers BySahana", type:"Event florist", area:"CBD", address:"Level 26/44 Market St, Sydney NSW 2000", rating:4.9, reviews:159, services:"Event centrepieces, restaurant delivery, fresh + artificial", specialties:"Restaurant/venue delivery, event centrepieces, palette matching", phone:"+61 492 995 540", hours:"24 hours", people:"Vaish", summary:"Delivers directly to restaurants and venues. Creates event centrepieces matched to dining room palettes. Fresh and artificial flower options. Coordinates delivery timing with venue staff.", website:"", priceGuide:"Contact for quote", colors:["#E8B4B8","#C5B358","#FFF8F0","#2D5A27"] },
  // ── CAKES ──
  { id:401, name:"Dessert Wagon", type:"Custom cake maker", area:"Bankstown", address:"Petunia Ave, Bankstown NSW 2200", rating:5.0, reviews:222, services:"Custom wedding cakes, birthday cakes, last-minute orders, eggless options", specialties:"Last-minute cake rescue, diverse flavours, personal delivery", phone:"+61 493 298 726", hours:"Daily 11 am – 9 pm", people:"Ami", summary:"5.0 with 222 reviews. Ami is known for last-minute saves when other vendors cancel. Delivers personally and ensures setup. Eggless options available.", website:"", priceGuide:"Mid-range (contact)", colors:["#D4A574","#FFF8F0","#8B4513","#C5B358"] },
  { id:402, name:"Flourette Cake Atelier", type:"Artisan wedding cakes", area:"Baulkham Hills", address:"James St, Baulkham Hills NSW 2153", rating:4.9, reviews:73, services:"Wedding cakes, tiered design, Asian fusion flavours", specialties:"Pandan, Thai milk tea, Lady Berry flavours, artistic decoration", phone:"+61 452 433 880", hours:"Mon–Fri 9 am – 5 pm", people:"Natasha", summary:"Natasha treats each cake as art. Unique flavour menu including pandan coconut and Thai milk tea. Tasting boxes available for remote couples. Reviewers describe cakes as 'works of art.'", website:"", priceGuide:"Multi-tier from ~$800", colors:["#4A6741","#FFF8F0","#C5B358","#E8B4B8"] },
  { id:403, name:"GRENA Patisserie", type:"Asian-fusion cakes", area:"Alexandria", address:"G09/78 O'Riordan St, Alexandria NSW 2015", rating:4.9, reviews:144, services:"Matcha cakes, taro cakes, yuzu cheesecake, dessert tables", specialties:"Asian-fusion flavours — matcha, taro, yuzu", phone:"+61 420 488 636", hours:"Wed–Sun", people:"Team", summary:"Matcha, taro, and yuzu specials. Popular for birthday celebrations. Not too sweet — balanced flavours praised by reviewers.", website:"", priceGuide:"6-inch from ~$60", colors:["#4A6741","#C5B358","#FFF8F0","#2D2D2D"] },
  { id:404, name:"The Green Bakery", type:"Gluten-free specialist", area:"North Sydney", address:"Shop G07/25-29 Berry St, North Sydney NSW 2060", rating:4.9, reviews:132, services:"Gluten-free cakes, wedding cakes, birthday cakes, cafe", specialties:"Gluten-free wedding cakes indistinguishable from regular", phone:"+61 420 945 245", hours:"Tue–Fri 7 am – 4 pm; Sat 8 am – 3 pm", people:"Deepthi", summary:"Deepthi's gluten-free cakes are described as indistinguishable from regular. Wedding and birthday focus. Also operates a cafe for tastings.", website:"", priceGuide:"Mid-range (contact)", colors:["#4A7C59","#FFF8F0","#DEB887","#2D2D2D"] },
  // ── LUXURY PICNIC ──
  { id:501, name:"Poppin Picnics", type:"Luxury picnic setup", area:"Kirribilli", address:"Waruda St, Kirribilli NSW 2061", rating:5.0, reviews:163, services:"Luxury picnic setup, styling, food, weather contingency", specialties:"Harbour-view proposal picnics, birthday picnics", phone:"", hours:"24 hours", people:"Paige", summary:"5.0 with 163 reviews. Paige handles everything including weather backup plans. Popular at Royal Botanic Garden and harbour-view locations.", website:"", priceGuide:"From ~$300", colors:["#E8B4B8","#4A7C59","#FFF8F0","#DEB887"] },
  { id:502, name:"Milk & Honey Picnics", type:"Premium picnic setup", area:"Vaucluse", address:"Military Rd, Vaucluse NSW 2030", rating:5.0, reviews:469, services:"Luxury picnics, engagement parties, bridal events, dietary catering", specialties:"Premium proposal + engagement picnics, custom dietary menus", phone:"+61 478 297 237", hours:"24 hours", people:"Vicki", summary:"5.0 with 469 reviews — highest-reviewed picnic service in Sydney. Vicki tailors food for dietary needs, offers flexible rescheduling. Eastern Suburbs based.", website:"", priceGuide:"From ~$400", colors:["#C4A87C","#355E3B","#FFF8F0","#E8D5B7"] },
  { id:503, name:"Sydney Picnic Co", type:"Gourmet picnic hampers", area:"Annandale", address:"29 Nelson St, Annandale NSW 2038", rating:4.9, reviews:37, services:"Gourmet picnic hampers, vegan options, pickup near Botanic Garden", specialties:"Food-first approach, vegan/dietary friendly, gift-worthy", phone:"+61 420 943 670", hours:"Mon–Sat 10 am – 5 pm", people:"Natalie", summary:"Food-first approach — reviewers describe it as 'the best meal I've ever eaten.' Pickup near Royal Botanic Garden. Gift-quality packaging.", website:"", priceGuide:"From ~$100 per person", colors:["#DEB887","#4A6741","#FFF8F0","#C2B280"] },
  // ── VIDEOGRAPHERS ──
  { id:601, name:"Dreamlife Wedding Photography & Video", type:"Photo + video + styling studio", area:"Stanmore", address:"1-2/43-53 Bridge Rd, Stanmore NSW 2048", rating:5.0, reviews:515, services:"Wedding photo, video, dress fitting, makeup, pre-wedding", specialties:"In-house styling (dress + makeup), Chinese-speaking team", phone:"+61 2 9518 6866", hours:"Wed–Sun 11 am – 6 pm", people:"Bernie, Forest, Jonas, Sienna, Kelly", summary:"Full service including dress fitting and makeup. Chinese-speaking team available. 515 reviews at 5.0 — largest reviewed wedding media studio in Sydney.", website:"dreamlifewedding.com.au", priceGuide:"Package pricing (contact)", colors:["#2C2C2C","#C5B358","#FFF8F0","#E8B4B8"] },
  { id:602, name:"Salt Atelier", type:"Premium photo + social content", area:"Camperdown", address:"Suite 1/10 Mallett St, Camperdown NSW 2050", rating:4.9, reviews:330, services:"Wedding photography, social content creation, reels", specialties:"Teams of 5+ shooters, Instagram-ready content alongside gallery", phone:"+61 2 7205 1849", hours:"Mon–Fri 10 am – 5 pm", people:"Kevin, Summer, Helen, Ryan", summary:"Teams of 5+ photographers per wedding. Unique social content creator role produces Instagram reels on the day alongside traditional gallery.", website:"saltatelier.com.au", priceGuide:"Premium (contact)", colors:["#1A1A1A","#DEB887","#FFF8F0","#4A6741"] },
  { id:603, name:"Arian Film Productions", type:"Cinematic wedding video", area:"St Leonards", address:"Suite 1/50 Atchison St, St Leonards NSW 2065", rating:5.0, reviews:16, services:"Wedding videography, same-day edits, cinematic style", specialties:"Background noise removal, same-day edit, cinematic storytelling", phone:"+61 425 204 938", hours:"Daily 9 am – 8 pm", people:"Ramin", summary:"Ramin can edit out background noise (even inaudible vows become clear). Same-day edit available. Cinematic storytelling style.", website:"", priceGuide:"Contact for quote", colors:["#2C3E50","#C4A87C","#FFF8F0","#1A1A1A"] },
  // ── DJs ──
  { id:701, name:"DJ Kelso", type:"Wedding DJ + MC", area:"Zetland", address:"Level 1/1-5 Link Rd, Zetland NSW 2017", rating:5.0, reviews:258, services:"DJ, MC, ceremony + reception, portable outdoor speakers", specialties:"Full ceremony-to-dancefloor, handles complex itineraries + custom mixes", phone:"+61 401 305 362", hours:"24 hours", people:"Brendan (Kelso)", summary:"5.0 with 258 reviews. Brendan handles complex itineraries — ceremony music, surprise fireworks cues, custom friend-made mixes. Portable outdoor speakers for garden ceremonies.", website:"", priceGuide:"Contact for quote", colors:["#1A1A2E","#E94560","#FFF8F0","#0F3460"] },
  { id:702, name:"Feels Music", type:"DJ + live saxophone", area:"Alexandria", address:"A1/35-39 Bourke Rd, Alexandria NSW 2015", rating:5.0, reviews:76, services:"DJ, live saxophone, wedding reception, entrance music", specialties:"DJ + live sax combo, high-energy entrance specialist", phone:"+61 421 002 100", hours:"24 hours", people:"Robbie (DJ), Evan (Sax)", summary:"Robbie DJs while Evan plays live sax over the top. Known for high-energy entrances. Even other professional wedding DJs recommend them.", website:"feelsmusic.com.au", priceGuide:"Contact for quote", colors:["#0F3460","#C5B358","#FFF8F0","#1A1A1A"] },
  { id:703, name:"Upbeat Social", type:"DJ + live piano/sax", area:"CBD", address:"Level 2/11 York St, Sydney NSW 2000", rating:5.0, reviews:171, services:"DJ, live piano, live sax, MC, wedding + corporate", specialties:"DJ + live instrument combos, MC services, corporate + wedding", phone:"+61 2 8015 5092", hours:"24 hours", people:"Tom, Hal, Taylor, Annie, Ben", summary:"Multiple artists available. DJ+sax and DJ+piano combos. Tom coordinates, also offers MC. Used by major corporate brands as well as weddings.", website:"upbeatsocial.com.au", priceGuide:"Contact for quote", colors:["#2C3E50","#DEB887","#FFF8F0","#1A1A1A"] },
  { id:704, name:"JJK Entertainment", type:"Wedding DJ + MC + lighting", area:"Panania", address:"20 Gowlland Parade, Panania NSW 2213", rating:5.0, reviews:134, services:"DJ, MC, lighting, live bouzouki, sound system supply", specialties:"All-in-one DJ+MC+lighting, multicultural music (Greek, Lebanese, Australian)", phone:"+61 418 205 630", hours:"Daily 9 am – 10 pm", people:"Jimmy", summary:"Jimmy supplies lighting, connects couples with live musicians (bouzouki), and creates custom mixes. Strong with multicultural audiences — Greek, Lebanese, Australian.", website:"", priceGuide:"Contact for quote", colors:["#1A1A2E","#C5B358","#FFF8F0","#8B0000"] },
  // ── LIVE MUSICIANS ──
  { id:801, name:"Stringspace", type:"String quartet / trio", area:"Kurraba Point", address:"16 Shellcove Rd, Kurraba Point NSW 2089", rating:5.0, reviews:15, services:"String quartet, trio, duo for ceremonies + cocktail hours", specialties:"Contemporary pop on strings, custom song learning, surprise songs", phone:"+61 412 582 437", hours:"Mon–Fri 9 am – 6 pm", people:"Lucie", summary:"Lucie coordinates. Extensive repertoire including pop and contemporary on strings. Will learn surprise songs for proposals. Ceremony + cocktail hour packages.", website:"stringspace.com.au", priceGuide:"From ~$800 (duo) to ~$2,000 (quartet)", colors:["#C2B280","#2C2C2C","#FFF8F0","#8B7355"] },
  { id:802, name:"Red Soda Band", type:"Live band + acoustic + sax", area:"Hurlstone Park", address:"26 Starkey St, Hurlstone Park NSW 2193", rating:4.9, reviews:489, services:"Live band (2-8 piece), acoustic solo/duo, saxophone, DJ set", specialties:"Ceremony acoustic to reception band to DJ set — full music journey", phone:"+61 2 8006 2234", hours:"24 hours", people:"Maddy, Tim, Courtney, Dom", summary:"Largest music agency found. Full transition: acoustic ceremony, cocktail band, reception DJ set. Courtney's voice 'stops rooms.' Dom adds live sax. 489 reviews.", website:"redsoda.com.au", priceGuide:"From ~$1,000 (solo) to ~$4,000+ (band)", colors:["#8B0000","#C5B358","#FFF8F0","#2C2C2C"] },
  { id:803, name:"Event Entertainers", type:"Music agency", area:"Cremorne", address:"233-237 Military Rd, Cremorne NSW 2090", rating:4.9, reviews:120, services:"Live bands, acoustic duos, string quartets, DJs — full roster", specialties:"One-stop booking for all wedding music (ceremony + cocktail + reception)", phone:"+61 2 8283 7348", hours:"24 hours", people:"Josie, Tim", summary:"Josie and Tim match couples with artists from a large roster. Book ceremony duo, cocktail quartet, and reception band in one call.", website:"evententertainers.com.au", priceGuide:"Varies by act", colors:["#2C3E50","#DEB887","#FFF8F0","#C2B280"] },
  // ── MCs ──
  { id:901, name:"Nathan Cassar", type:"Wedding + corporate MC", area:"Mays Hill", address:"Unit 23/206 Burnett St, Mays Hill NSW 2145", rating:5.0, reviews:128, services:"Wedding MC, corporate MC, event host, quiz host", specialties:"High-energy hosting, wardrobe changes, vendor coordination", phone:"", hours:"24 hours", people:"Nathan", summary:"5.0 with 128 reviews. Nathan coordinates with all vendors, does wardrobe changes between ceremony and reception, and dances with guests. High energy.", website:"nathancassar.com.au", priceGuide:"Contact for quote", colors:["#1A1A1A","#C5B358","#FFF8F0","#E94560"] },
  { id:902, name:"Johan the Celebrant & MC", type:"Celebrant + MC combo", area:"Kyle Bay", address:"16A Merriman St, Kyle Bay NSW 2221", rating:5.0, reviews:276, services:"Marriage celebrant, wedding MC, event host", specialties:"Celebrant + MC in one person, humour + heartfelt balance", phone:"+61 411 324 076", hours:"Daily 9 am – 11:30 pm", people:"Johan", summary:"5.0 with 276 reviews. Johan officiates the ceremony AND MCs the reception — saving a booking. Known for fabulous suits and infectious humour that balances perfectly with heartfelt moments.", website:"", priceGuide:"Contact for quote", colors:["#2C2C2C","#C4A87C","#FFF8F0","#8B7355"] },
];

/* ═══════════════════════════════════════════════════════════
   SHARED DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════ */
const F = { serif:"'Cormorant Garamond', Georgia, serif", sans:"'DM Sans', -apple-system, sans-serif", mono:"'DM Mono', monospace" };
const BG = "#FCFBF9";
const lbl = { fontSize:"11px", color:"#999", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:F.sans, fontWeight:600 };
const btn = (on) => ({ padding:"7px 16px", border:"1px solid", borderRadius:0, cursor:"pointer", borderColor:on?"#1a1a1a":"#ccc", background:on?"#1a1a1a":"transparent", color:on?"#fff":"#666", fontSize:"12px", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:F.sans, fontWeight:600, transition:"all 0.2s" });
const primaryBtn = { padding:"15px 36px", border:"1px solid #1a1a1a", background:"#1a1a1a", color:"#fff", fontSize:"13px", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", fontFamily:F.sans, fontWeight:600, transition:"all 0.25s" };
const hoverInvert = { onMouseEnter: e => { e.target.style.background="transparent"; e.target.style.color="#1a1a1a"; }, onMouseLeave: e => { e.target.style.background="#1a1a1a"; e.target.style.color="#fff"; } };
const ghostBtn = { ...primaryBtn, background:"transparent", color:"#666", borderColor:"#ccc" };
const ghostHover = { onMouseEnter: e => { e.target.style.borderColor="#1a1a1a"; e.target.style.color="#1a1a1a"; }, onMouseLeave: e => { e.target.style.borderColor="#ccc"; e.target.style.color="#666"; } };
const inputStyle = { width:"100%", padding:"14px 0", border:"none", borderBottom:"1.5px solid #ddd", background:"transparent", fontSize:"15px", outline:"none", fontFamily:F.sans, color:"#1a1a1a", transition:"border-color 0.2s" };
const focusBorder = { onFocus: e => e.target.style.borderBottomColor="#1a1a1a", onBlur: e => e.target.style.borderBottomColor="#ddd" };

function ColorBar({ colors, h=3 }) { return <div style={{ display:"flex", height:`${h}px`, overflow:"hidden" }}>{colors.map((c,i)=><div key={i} style={{ flex:1, background:c }}/>)}</div>; }
function Dots({ score, s=7 }) { return <div style={{ display:"flex", gap:"3px" }}>{[1,2,3,4,5].map(i=><div key={i} style={{ width:`${s}px`, height:`${s}px`, borderRadius:"50%", background:i<=score?"#1a1a1a":"#ddd" }}/>)}</div>; }
function Bars({ score }) { return <div style={{ display:"flex", gap:"4px" }}>{[1,2,3,4,5].map(i=><div key={i} style={{ width:"24px", height:"6px", borderRadius:"3px", background:i<=score?"#1a1a1a":"#e5e5e5" }}/>)}</div>; }
function Swatches({ colors }) { return <div style={{ display:"flex", gap:"7px" }}>{colors.map((c,i)=><div key={i} style={{ width:"24px", height:"24px", borderRadius:"5px", background:c, border:"1px solid rgba(0,0,0,0.08)" }}/>)}</div>; }
function BackLink({ navigate, to, label }) { return <span onClick={()=>navigate(to)} style={{ ...lbl, cursor:"pointer", display:"inline-block", marginBottom:"32px", borderBottom:"1px solid transparent", transition:"border-color 0.2s" }} onMouseEnter={e=>e.target.style.borderBottomColor="#999"} onMouseLeave={e=>e.target.style.borderBottomColor="transparent"}>{label}</span>; }

/* ═══════════════════════ ROUTING ═══════════════════════ */
function useRouter() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => { const h=()=>setHash(window.location.hash||"#/"); window.addEventListener("hashchange",h); return ()=>window.removeEventListener("hashchange",h); }, []);
  return { hash, navigate: useCallback(p => { window.location.hash = p; }, []) };
}

/* ═══════════════════════ NAV + FOOTER ═══════════════════════ */
function Nav({ navigate, current }) {
  const links = [{ p:"#/", l:"Home" },{ p:"#/venues", l:"Venues" },{ p:"#/planners", l:"Planners" },{ p:"#/about", l:"About" },{ p:"#/consult", l:"Consult" }];
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:BG, borderBottom:"1px solid #eee", padding:"0 32px", display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:"1000px", margin:"0 auto" }}>
      <div onClick={()=>navigate("#/")} style={{ cursor:"pointer", padding:"18px 0", fontFamily:F.sans, fontSize:"13px", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase" }}>Moment</div>
      <div style={{ display:"flex", gap:"20px" }}>
        {links.map(l => {
          const active = l.p === "#/" ? current === "#/" || current === "#" : current.startsWith(l.p);
          return <span key={l.p} onClick={()=>navigate(l.p)} style={{ cursor:"pointer", padding:"18px 0", fontSize:"11px", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:F.sans, fontWeight:500, color:active?"#1a1a1a":"#aaa", borderBottom:active?"1px solid #1a1a1a":"1px solid transparent", transition:"all 0.2s" }}>{l.l}</span>;
        })}
      </div>
    </nav>
  );
}
function Footer({ navigate }) {
  return (
    <footer style={{ maxWidth:"860px", margin:"0 auto", borderTop:"1px solid #eee", padding:"32px 32px 48px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"24px", marginBottom:"24px" }}>
        <div>
          <div style={{ fontFamily:F.sans, fontSize:"13px", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px" }}>Moment</div>
          <div style={{ fontSize:"12px", color:"#aaa", lineHeight:1.7 }}>Curated venues and planning<br/>for Sydney's important moments</div>
        </div>
        <div style={{ display:"flex", gap:"24px" }}>
          {[["#/venues","Venues"],["#/planners","Planners"],["#/consult","Consult"],["#/about","About"]].map(([p,l])=>(
            <span key={p} onClick={()=>navigate(p)} style={{ fontSize:"11px", color:"#aaa", letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", fontFamily:F.sans, transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color="#1a1a1a"} onMouseLeave={e=>e.target.style.color="#aaa"}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{ fontSize:"10px", color:"#ccc", letterSpacing:"0.1em", textAlign:"center" }}>
        DATA VIA GOOGLE PLACES API / LLM ANALYSIS / CONTINUOUSLY UPDATED
      </div>
    </footer>
  );
}

/* ═══════════════════════ PAGE: HOME ═══════════════════════ */
function HomePage({ navigate }) {
  return <div style={{ animation:"fadeIn 0.6s ease" }}>
    <section style={{ padding:"100px 32px 80px", maxWidth:"860px", margin:"0 auto", textAlign:"center" }}>
      <div style={{ ...lbl, marginBottom:"16px", letterSpacing:"0.25em" }}>Sydney, Australia</div>
      <h1 style={{ margin:"0 0 20px", fontSize:"50px", fontWeight:300, fontFamily:F.serif, lineHeight:1.1 }}>Every moment{"\n"}deserves its place</h1>
      <p style={{ margin:"0 auto 40px", maxWidth:"400px", fontSize:"16px", lineHeight:1.8, color:"#888", fontFamily:F.serif, fontStyle:"italic" }}>Curated venues and dedicated planners for proposals, anniversaries, and celebrations across Sydney.</p>
      <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
        <button onClick={()=>navigate("#/venues")} style={primaryBtn} {...hoverInvert}>Browse venues</button>
        <button onClick={()=>navigate("#/planners")} style={ghostBtn} {...ghostHover}>Meet suppliers</button>
      </div>
    </section>
    <section style={{ borderTop:"1px solid #eee", borderBottom:"1px solid #eee", maxWidth:"860px", margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", textAlign:"center" }}>
        {[{ n:"50", l:"Curated venues" },{ n:"45+", l:"Verified suppliers" },{ n:"4.6", l:"Avg venue rating" },{ n:"24h", l:"Response time" }].map((s,i)=>(
          <div key={i} style={{ padding:"36px 16px", borderRight:i<3?"1px solid #eee":"none" }}>
            <div style={{ fontSize:"28px", fontFamily:F.serif, fontWeight:300, marginBottom:"4px" }}>{s.n}</div>
            <div style={lbl}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
    <section style={{ padding:"72px 32px", maxWidth:"860px", margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"36px" }}>
        <h2 style={{ margin:0, fontSize:"26px", fontWeight:300, fontFamily:F.serif }}>Featured venues</h2>
        <span onClick={()=>navigate("#/venues")} style={{ ...lbl, cursor:"pointer" }}>View all</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"24px" }}>
        {VENUES.filter(v=>v.proposalScore===5).slice(0,3).map(v=>(
          <div key={v.id} onClick={()=>navigate(`#/venue/${v.id}`)} style={{ cursor:"pointer", transition:"opacity 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <ColorBar colors={v.colors} h={4} />
            <div style={{ paddingTop:"14px" }}>
              <div style={{ fontSize:"13px", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:F.sans, marginBottom:"4px" }}>{v.name}</div>
              <div style={{ fontSize:"13px", color:"#888", fontFamily:F.serif, fontStyle:"italic" }}>{v.style}</div>
              <div style={{ fontSize:"11px", color:"#bbb", marginTop:"6px" }}>{v.area}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <section style={{ borderTop:"1px solid #eee", padding:"72px 32px", maxWidth:"860px", margin:"0 auto" }}>
      <h2 style={{ margin:"0 0 40px", fontSize:"26px", fontWeight:300, fontFamily:F.serif, textAlign:"center" }}>How it works</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"36px" }}>
        {[{ s:"01", t:"Browse", d:"Filter venues by type, area, palette, and suitability. Every detail is researched and verified." },
          { s:"02", t:"Connect", d:"Choose a planner from our vetted directory, or submit a consultation and we match you." },
          { s:"03", t:"Celebrate", d:"Your planner coordinates everything — venue, flowers, photography, logistics. You just show up." }
        ].map(s=>(
          <div key={s.s}>
            <div style={{ fontSize:"28px", fontFamily:F.mono, color:"#ddd", marginBottom:"10px" }}>{s.s}</div>
            <div style={{ fontSize:"13px", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:F.sans, marginBottom:"6px" }}>{s.t}</div>
            <p style={{ margin:0, fontSize:"13px", lineHeight:1.7, color:"#888" }}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={{ borderTop:"1px solid #eee", padding:"72px 32px", maxWidth:"860px", margin:"0 auto", textAlign:"center" }}>
      <h2 style={{ margin:"0 0 12px", fontSize:"26px", fontWeight:300, fontFamily:F.serif }}>Ready to begin?</h2>
      <p style={{ margin:"0 0 28px", fontSize:"14px", color:"#888", fontFamily:F.serif, fontStyle:"italic" }}>Tell us about your occasion and we will find the perfect setting.</p>
      <button onClick={()=>navigate("#/consult")} style={primaryBtn} {...hoverInvert}>Start a consultation</button>
    </section>
  </div>;
}

/* ═══════════════════════ PAGE: VENUES LIST ═══════════════════════ */
function VenuesPage({ navigate }) {
  const [cat, setCat] = useState("all");
  const [priv, setPriv] = useState(false);
  const [min, setMin] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("rating");
  const cats = [{ k:"all",l:"All" },{ k:"dining",l:"Dining" },{ k:"garden",l:"Garden" },{ k:"chapel",l:"Chapel" },{ k:"waterfront",l:"Waterfront" },{ k:"rooftop",l:"Rooftop" },{ k:"winery",l:"Winery" },{ k:"hotel",l:"Hotel" }];
  const list = useMemo(() => {
    let r = VENUES.filter(v => { if(cat!=="all"&&v.category!==cat)return false; if(priv&&!v.hasPrivateRoom)return false; if(v.proposalScore<min)return false; if(q){ const s=q.toLowerCase(); return v.name.toLowerCase().includes(s)||v.area.toLowerCase().includes(s)||v.style.toLowerCase().includes(s)||v.tags.some(t=>t.includes(s)); } return true; });
    if(sort==="rating")r.sort((a,b)=>b.rating-a.rating); else if(sort==="score")r.sort((a,b)=>b.proposalScore-a.proposalScore); else r.sort((a,b)=>b.reviews-a.reviews);
    return r;
  }, [cat,priv,min,q,sort]);
  return <div style={{ animation:"fadeIn 0.5s ease" }}>
    <header style={{ padding:"44px 32px 32px", maxWidth:"860px", margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"24px" }}>
        <div><div style={{ ...lbl, marginBottom:"6px" }}>Venue directory</div><h1 style={{ margin:0, fontSize:"32px", fontWeight:300, fontFamily:F.serif }}>Venues</h1></div>
        <div style={{ fontSize:"11px", color:"#bbb" }}>{list.length} result{list.length!==1?"s":""}</div>
      </div>
      <input type="text" placeholder="Search by name, area, or style..." value={q} onChange={e=>setQ(e.target.value)} style={inputStyle} {...focusBorder} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"16px", flexWrap:"wrap", gap:"10px" }}>
        <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>{cats.map(c=><button key={c.k} onClick={()=>setCat(c.k)} style={btn(cat===c.k)}>{c.l}</button>)}</div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center", flexWrap:"wrap" }}>
          <button onClick={()=>setPriv(!priv)} style={btn(priv)}>Private room</button>
          <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
            <span style={{ fontSize:"10px", color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase" }}>Score</span>
            {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setMin(n)} style={{ ...btn(min===n), width:"24px", height:"24px", padding:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.mono }}>{n}</button>)}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:"6px 10px", border:"1px solid #ddd", background:"transparent", fontSize:"11px", color:"#888", fontFamily:F.sans, cursor:"pointer", outline:"none", borderRadius:0 }}>
            <option value="rating">By rating</option><option value="score">By suitability</option><option value="reviews">By reviews</option>
          </select>
        </div>
      </div>
    </header>
    <main style={{ maxWidth:"860px", margin:"0 auto", padding:"0 32px 72px" }}>
      <div style={{ borderTop:"1px solid #eee" }}>
        {list.map((v,i)=>(
          <div key={v.id} onClick={()=>navigate(`#/venue/${v.id}`)} style={{ padding:"22px 0", borderBottom:"1px solid #eee", cursor:"pointer", opacity:0, animation:`slideUp 0.5s ease ${i*0.04}s forwards` }}>
            <ColorBar colors={v.colors} h={3} />
            <div style={{ paddingTop:"12px", display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"4px" }}>
              <h3 style={{ margin:0, fontSize:"16px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", fontFamily:F.sans }}>{v.name}</h3>
              <span style={{ fontSize:"13px", color:"#888", fontFamily:F.mono }}>{v.rating}<span style={{ color:"#bbb" }}> / 5</span></span>
            </div>
            <p style={{ margin:"0 0 6px", color:"#666", fontFamily:F.serif, fontStyle:"italic", fontSize:"15px" }}>{v.style}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"13px", color:"#999" }}>{v.area}</span>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                {v.hasPrivateRoom && <span style={{ fontSize:"11px", color:"#666", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600 }}>Private room</span>}
                <Dots score={v.proposalScore} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {list.length===0 && <div style={{ padding:"72px 0", textAlign:"center", color:"#bbb", fontFamily:F.serif, fontStyle:"italic" }}>No venues match these filters.</div>}
    </main>
  </div>;
}

/* ═══════════════════════ PAGE: VENUE DETAIL ═══════════════════════ */
function VenueDetailPage({ id, navigate }) {
  const v = VENUES.find(x=>x.id===Number(id));
  if(!v) return <div style={{ padding:"100px 32px", textAlign:"center", color:"#aaa", fontFamily:F.serif, fontStyle:"italic" }}>Venue not found.</div>;
  return <div style={{ animation:"fadeIn 0.5s ease" }}>
    <div style={{ maxWidth:"680px", margin:"0 auto", padding:"44px 32px 72px" }}>
      <BackLink navigate={navigate} to="#/venues" label="Back to venues" />
      <ColorBar colors={v.colors} h={6} />
      <div style={{ paddingTop:"28px", marginBottom:"36px" }}>
        <span style={{ ...lbl, display:"block", marginBottom:"6px" }}>{v.area} / {v.category} / {v.price}</span>
        <h1 style={{ margin:"0 0 6px", fontSize:"36px", fontWeight:300, fontFamily:F.serif }}>{v.name}</h1>
        <p style={{ margin:"0 0 4px", fontSize:"16px", color:"#666", fontFamily:F.serif, fontStyle:"italic" }}>{v.style}</p>
        <p style={{ margin:0, fontSize:"14px", color:"#999" }}>{v.address}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"28px", padding:"28px 0", borderTop:"1px solid #eee", borderBottom:"1px solid #eee" }}>
        <div><div style={lbl}>Proposal suitability</div><div style={{ marginTop:"8px" }}><Bars score={v.proposalScore} /></div></div>
        <div><div style={lbl}>Colour palette</div><div style={{ marginTop:"8px" }}><Swatches colors={v.colors} /></div><div style={{ fontSize:"13px", color:"#999", marginTop:"4px" }}>{v.palette}</div></div>
      </div>
      <div style={{ padding:"28px 0", borderBottom:"1px solid #eee" }}>
        <p style={{ margin:0, fontSize:"17px", lineHeight:1.85, color:"#333", fontFamily:F.serif }}>{v.summary}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"22px", padding:"28px 0", borderBottom:"1px solid #eee" }}>
        {[["Private dining",v.privateRoomNote],["Capacity",v.capacity],["Hours",v.hours],["Rating",`${v.rating} / 5 — ${v.reviews} reviews`],["Best for",v.bestFor]].map(([l,val])=>(
          <div key={l}><div style={lbl}>{l}</div><div style={{ fontSize:"14px", color:"#444", lineHeight:1.6, marginTop:"5px" }}>{val}</div></div>
        ))}
        <div>
          <div style={lbl}>Contact</div>
          {v.phone ? <a href={`tel:${v.phone}`} style={{ fontSize:"14px", color:"#1a1a1a", lineHeight:1.6, marginTop:"5px", display:"block", textDecoration:"none", borderBottom:"1px solid #ddd", paddingBottom:"2px", transition:"border-color 0.2s" }} onMouseEnter={e=>e.target.style.borderBottomColor="#1a1a1a"} onMouseLeave={e=>e.target.style.borderBottomColor="#ddd"}>{v.phone}</a>
          : <div style={{ fontSize:"14px", color:"#999", marginTop:"5px" }}>Enquire via form below</div>}
        </div>
      </div>
      <div style={{ padding:"28px 0", borderBottom:"1px solid #eee" }}>
        <div style={lbl}>Attributes</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"10px" }}>
          {v.tags.map(t=><span key={t} style={{ fontSize:"12px", padding:"5px 12px", border:"1px solid #ddd", color:"#555", fontFamily:F.sans, fontWeight:500 }}>{t}</span>)}
        </div>
      </div>
      <div style={{ fontSize:"11px", color:"#bbb", lineHeight:1.6, padding:"24px 0", borderBottom:"1px solid #eee" }}>
        Palette, style, and suitability data extracted automatically via Google Places API and LLM analysis.
      </div>
      <div style={{ display:"flex", gap:"12px", paddingTop:"28px" }}>
        <button onClick={()=>navigate(`#/consult?venue=${encodeURIComponent(v.name)}`)} style={{ ...primaryBtn, flex:1 }} {...hoverInvert}>Enquire about this venue</button>
        <button onClick={()=>navigate("#/planners")} style={{ ...ghostBtn, flex:1 }} {...ghostHover}>Find a planner</button>
      </div>
      {/* Related venues */}
      {(() => {
        const related = VENUES.filter(x => x.id !== v.id && x.category === v.category).slice(0, 3);
        if (related.length === 0) return null;
        return <div style={{ paddingTop:"40px", marginTop:"40px", borderTop:"1px solid #eee" }}>
          <div style={{ ...lbl, marginBottom:"16px" }}>You might also like</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"16px" }}>
            {related.map(r => (
              <div key={r.id} onClick={()=>{ navigate(`#/venue/${r.id}`); window.scrollTo({top:0}); }} style={{ cursor:"pointer", transition:"opacity 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <ColorBar colors={r.colors} h={3} />
                <div style={{ paddingTop:"8px" }}>
                  <div style={{ fontSize:"13px", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", fontFamily:F.sans }}>{r.name}</div>
                  <div style={{ fontSize:"12px", color:"#888", fontFamily:F.serif, fontStyle:"italic", marginTop:"2px" }}>{r.style}</div>
                  <div style={{ fontSize:"11px", color:"#bbb", marginTop:"3px" }}>{r.area} / {r.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>;
      })()}
    </div>
  </div>;
}

/* ═══════════════════════ PAGE: PLANNERS LIST ═══════════════════════ */
function PlannersPage({ navigate }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = [{ k:"all",l:"All" },{ k:"planner",l:"Planners" },{ k:"stylist",l:"Stylists" },{ k:"photographer",l:"Photographers" },{ k:"florist",l:"Florists" },{ k:"cake",l:"Cakes" },{ k:"picnic",l:"Picnics" },{ k:"video",l:"Videographers" },{ k:"dj",l:"DJs" },{ k:"musician",l:"Musicians" },{ k:"mc",l:"MCs" }];
  const catMap = { planner:[101,102,103,104,105,109], stylist:[106,107,108,110], photographer:[201,202,203,204,205], florist:[301,302,303,304], cake:[401,402,403,404], picnic:[501,502,503], video:[601,602,603], dj:[701,702,703,704], musician:[801,802,803], mc:[901,902] };
  const list = useMemo(() => {
    let r = PLANNERS;
    if (cat !== "all") r = r.filter(p => catMap[cat]?.includes(p.id));
    if (q) { const s = q.toLowerCase(); r = r.filter(p => p.name.toLowerCase().includes(s) || p.type.toLowerCase().includes(s) || p.area.toLowerCase().includes(s) || p.specialties.toLowerCase().includes(s) || p.people.toLowerCase().includes(s)); }
    return r;
  }, [q, cat]);
  return <div style={{ animation:"fadeIn 0.5s ease" }}>
    <header style={{ padding:"44px 32px 32px", maxWidth:"860px", margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"24px" }}>
        <div><div style={{ ...lbl, marginBottom:"6px" }}>Planner directory</div><h1 style={{ margin:0, fontSize:"32px", fontWeight:300, fontFamily:F.serif }}>Planners</h1></div>
        <div style={{ fontSize:"11px", color:"#bbb" }}>{list.length} planner{list.length!==1?"s":""}</div>
      </div>
      <input type="text" placeholder="Search by name, type, area, or specialty..." value={q} onChange={e=>setQ(e.target.value)} style={inputStyle} {...focusBorder} />
      <div style={{ display:"flex", gap:"4px", marginTop:"16px", flexWrap:"wrap" }}>
        {cats.map(c=><button key={c.k} onClick={()=>setCat(c.k)} style={btn(cat===c.k)}>{c.l}</button>)}
      </div>
    </header>
    <main style={{ maxWidth:"860px", margin:"0 auto", padding:"0 32px 72px" }}>
      <div style={{ borderTop:"1px solid #eee" }}>
        {list.map((p,i)=>(
          <div key={p.id} onClick={()=>navigate(`#/planner/${p.id}`)} style={{ padding:"22px 0", borderBottom:"1px solid #eee", cursor:"pointer", opacity:0, animation:`slideUp 0.5s ease ${i*0.04}s forwards` }}>
            <ColorBar colors={p.colors} h={3} />
            <div style={{ paddingTop:"12px", display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"4px" }}>
              <h3 style={{ margin:0, fontSize:"14px", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:F.sans }}>{p.name}</h3>
              <span style={{ fontSize:"12px", color:"#999", fontFamily:F.mono }}>{p.rating}<span style={{ color:"#ccc" }}> / 5</span></span>
            </div>
            <p style={{ margin:"0 0 6px", color:"#888", fontFamily:F.serif, fontStyle:"italic", fontSize:"13px" }}>{p.type}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"11px", color:"#aaa" }}>{p.area}</span>
              <span style={{ fontSize:"11px", color:"#aaa" }}>{p.reviews} reviews</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>;
}

/* ═══════════════════════ PAGE: PLANNER DETAIL ═══════════════════════ */
function PlannerDetailPage({ id, navigate }) {
  const p = PLANNERS.find(x=>x.id===Number(id));
  if(!p) return <div style={{ padding:"100px 32px", textAlign:"center", color:"#aaa", fontFamily:F.serif, fontStyle:"italic" }}>Planner not found.</div>;
  return <div style={{ animation:"fadeIn 0.5s ease" }}>
    <div style={{ maxWidth:"680px", margin:"0 auto", padding:"44px 32px 72px" }}>
      <BackLink navigate={navigate} to="#/planners" label="Back to planners" />
      <ColorBar colors={p.colors} h={6} />
      <div style={{ paddingTop:"28px", marginBottom:"36px" }}>
        <span style={{ ...lbl, display:"block", marginBottom:"6px" }}>{p.area} / {p.type}</span>
        <h1 style={{ margin:"0 0 6px", fontSize:"36px", fontWeight:300, fontFamily:F.serif }}>{p.name}</h1>
        <p style={{ margin:"0 0 4px", fontSize:"14px", color:"#888", fontFamily:F.serif, fontStyle:"italic" }}>{p.type}</p>
        <p style={{ margin:0, fontSize:"13px", color:"#aaa" }}>{p.address}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"28px", padding:"28px 0", borderTop:"1px solid #eee", borderBottom:"1px solid #eee" }}>
        <div><div style={lbl}>Rating</div><div style={{ fontSize:"14px", color:"#555", marginTop:"6px" }}>{p.rating} / 5 — {p.reviews} reviews</div></div>
        <div><div style={lbl}>Price guide</div><div style={{ fontSize:"14px", color:"#555", marginTop:"6px" }}>{p.priceGuide}</div></div>
      </div>
      <div style={{ padding:"28px 0", borderBottom:"1px solid #eee" }}>
        <p style={{ margin:0, fontSize:"16px", lineHeight:1.85, color:"#444", fontFamily:F.serif }}>{p.summary}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"22px", padding:"28px 0", borderBottom:"1px solid #eee" }}>
        {[["Services",p.services],["Specialties",p.specialties],["Key people",p.people],["Hours",p.hours],["Location",p.area]].map(([l,val])=>(
          <div key={l}><div style={lbl}>{l}</div><div style={{ fontSize:"14px", color:"#444", lineHeight:1.6, marginTop:"5px" }}>{val}</div></div>
        ))}
        <div>
          <div style={lbl}>Phone</div>
          {p.phone ? <a href={`tel:${p.phone}`} style={{ fontSize:"14px", color:"#1a1a1a", lineHeight:1.6, marginTop:"5px", display:"block", textDecoration:"none", borderBottom:"1px solid #ddd", paddingBottom:"2px", transition:"border-color 0.2s" }} onMouseEnter={e=>e.target.style.borderBottomColor="#1a1a1a"} onMouseLeave={e=>e.target.style.borderBottomColor="#ddd"}>{p.phone}</a>
          : <div style={{ fontSize:"14px", color:"#999", marginTop:"5px" }}>Enquire via form below</div>}
        </div>
      </div>
      <div style={{ fontSize:"11px", color:"#bbb", lineHeight:1.6, padding:"24px 0", borderBottom:"1px solid #eee" }}>
        Planner information sourced from Google Places reviews and verified web presence.
      </div>
      <div style={{ display:"flex", gap:"12px", paddingTop:"28px" }}>
        <button onClick={()=>navigate(`#/consult?planner=${encodeURIComponent(p.name)}`)} style={{ ...primaryBtn, flex:1 }} {...hoverInvert}>Request this planner</button>
        <button onClick={()=>navigate("#/venues")} style={{ ...ghostBtn, flex:1 }} {...ghostHover}>Browse venues</button>
      </div>
    </div>
  </div>;
}

/* ═══════════════════════ PAGE: CONSULT ═══════════════════════ */
function ConsultPage({ navigate }) {
  const params = new URLSearchParams(window.location.hash.split("?")[1]||"");
  const [form, setForm] = useState({ name:"", email:"", phone:"", occasion:"proposal", date:"", guests:"2", venue:params.get("venue")||"", planner:params.get("planner")||"", budget:"", notes:"" });
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = async () => {
    if (!form.name) { setError("Please enter your name"); return; }
    if (!form.email) { setError("Please enter your email"); return; }
    if (!form.email.includes("@")) { setError("Please enter a valid email address"); return; }
    setError("");
    setSending(true);
    try {
      const FORMSPREE_ID = "maqayvob";
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          occasion: form.occasion,
          date: form.date,
          guests: form.guests,
          venue: form.venue,
          planner: form.planner,
          budget: form.budget,
          notes: form.notes,
          _subject: `Moment — New ${form.occasion} enquiry from ${form.name}`,
        }),
      });
      setDone(true);
    } catch (e) {
      setDone(true);
    }
    setSending(false);
  };
  if(done) return <div style={{ animation:"fadeIn 0.5s ease", padding:"80px 32px", maxWidth:"500px", margin:"0 auto", textAlign:"center" }}>
    <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:"#1a1a1a", margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"22px" }}>&#10003;</div>
    <h2 style={{ margin:"0 0 12px", fontSize:"28px", fontWeight:300, fontFamily:F.serif }}>Thank you, {form.name}</h2>
    <p style={{ margin:"0 0 12px", fontSize:"16px", color:"#666", fontFamily:F.serif, fontStyle:"italic", lineHeight:1.7 }}>Your request has been received.</p>
    <p style={{ margin:"0 0 8px", fontSize:"14px", color:"#888", lineHeight:1.7 }}>We will respond to <strong style={{ color:"#555" }}>{form.email}</strong> within 24 hours.</p>
    {form.venue && <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#999" }}>Venue interest: {form.venue}</p>}
    {form.occasion && <p style={{ margin:"0 0 24px", fontSize:"13px", color:"#999" }}>Occasion: {form.occasion} {form.date ? `on ${form.date}` : ""}</p>}
    <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap", marginTop:"12px" }}>
      <button onClick={()=>navigate("#/venues")} style={primaryBtn} {...hoverInvert}>Browse more venues</button>
      <button onClick={()=>navigate("#/")} style={ghostBtn} {...ghostHover}>Back to home</button>
    </div>
  </div>;
  return <div style={{ animation:"fadeIn 0.5s ease" }}>
    <div style={{ maxWidth:"500px", margin:"0 auto", padding:"44px 32px 72px" }}>
      <div style={{ ...lbl, marginBottom:"6px" }}>Free consultation</div>
      <h1 style={{ margin:"0 0 6px", fontSize:"30px", fontWeight:300, fontFamily:F.serif }}>Tell us about your occasion</h1>
      <p style={{ margin:"0 0 36px", fontSize:"14px", color:"#888", fontFamily:F.serif, fontStyle:"italic" }}>A dedicated planner responds within 24 hours.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>
        {[["Name","name","Full name","text"],["Email","email","Email address","email"],["Phone","phone","Phone number","tel"]].map(([l,k,ph,t])=>(
          <div key={k}><div style={lbl}>{l}</div><input type={t} placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} style={inputStyle} {...focusBorder} /></div>
        ))}
        <div><div style={lbl}>Occasion</div><div style={{ display:"flex", gap:"6px", marginTop:"8px", flexWrap:"wrap" }}>
          {["proposal","anniversary","birthday","private event"].map(o=><button key={o} onClick={()=>set("occasion",o)} style={btn(form.occasion===o)}>{o}</button>)}
        </div></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px" }}>
          <div><div style={lbl}>Preferred date</div><input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inputStyle} {...focusBorder} /></div>
          <div><div style={lbl}>Guests</div><input type="number" min="1" value={form.guests} onChange={e=>set("guests",e.target.value)} style={inputStyle} {...focusBorder} /></div>
        </div>
        <div><div style={lbl}>Preferred venue (optional)</div><input type="text" placeholder="Venue name or leave blank" value={form.venue} onChange={e=>set("venue",e.target.value)} style={inputStyle} {...focusBorder} /></div>
        <div><div style={lbl}>Preferred planner (optional)</div><input type="text" placeholder="Planner name or leave blank" value={form.planner} onChange={e=>set("planner",e.target.value)} style={inputStyle} {...focusBorder} /></div>
        <div><div style={lbl}>Budget range</div><div style={{ display:"flex", gap:"6px", marginTop:"8px", flexWrap:"wrap" }}>
          {["Under $1k","$1k–$3k","$3k–$5k","$5k+","Flexible"].map(b=><button key={b} onClick={()=>set("budget",b)} style={btn(form.budget===b)}>{b}</button>)}
        </div></div>
        <div><div style={lbl}>Additional notes</div><textarea placeholder="Any special requests, dietary needs, surprise elements..." value={form.notes} onChange={e=>set("notes",e.target.value)} rows={4} style={{ ...inputStyle, resize:"vertical", lineHeight:1.6 }} {...focusBorder} /></div>
        {error && <div style={{ fontSize:"13px", color:"#c0392b", padding:"8px 0", fontWeight:500 }}>{error}</div>}
        <button onClick={handleSubmit} disabled={sending} style={{ ...primaryBtn, width:"100%", marginTop:"8px", opacity:form.name&&form.email&&!sending?1:0.4 }} {...hoverInvert}>{sending ? "Sending..." : "Submit request"}</button>
        <p style={{ margin:"8px 0 0", fontSize:"12px", color:"#bbb", textAlign:"center", lineHeight:1.6 }}>Free consultation, no commitment. We typically respond the same day.</p>
      </div>
    </div>
  </div>;
}

/* ═══════════════════════ PAGE: ABOUT ═══════════════════════ */
function AboutPage({ navigate }) {
  return <div style={{ animation:"fadeIn 0.5s ease" }}>
    <div style={{ maxWidth:"600px", margin:"0 auto", padding:"56px 32px 72px" }}>
      <div style={{ ...lbl, marginBottom:"6px" }}>About</div>
      <h1 style={{ margin:"0 0 28px", fontSize:"30px", fontWeight:300, fontFamily:F.serif }}>The story behind Moment</h1>
      <div style={{ fontSize:"16px", lineHeight:1.85, color:"#555", fontFamily:F.serif }}>
        <p style={{ margin:"0 0 20px" }}>Moment started with a simple frustration — planning a proposal in Sydney and finding no single place that combined curated venue information with actual event planning support.</p>
        <p style={{ margin:"0 0 20px" }}>Venue listing sites gave addresses and reviews. Event planners required expensive consultations before you even knew what you wanted. The gap between browsing and executing felt unnecessarily wide.</p>
        <p style={{ margin:"0 0 20px" }}>We bridge that gap. Every venue in our collection is researched in detail — colour palette, private dining options, acoustic feel, how the light falls at different hours. Information that matters when you are planning something that will be remembered for a lifetime.</p>
        <p style={{ margin:"0 0 20px" }}>Our planner directory is equally considered. Every planner is verified through public reviews and direct research. We include their key people, specialties, and price guides so you can find the right fit without a sales call.</p>
        <p style={{ margin:0 }}>When you are ready, submit a consultation. No upfront fees. No minimum spend. Just a conversation about what you want, and a planner who knows how to make it happen.</p>
      </div>
      <div style={{ borderTop:"1px solid #eee", marginTop:"36px", paddingTop:"36px" }}>
        <h2 style={{ margin:"0 0 24px", fontSize:"22px", fontWeight:300, fontFamily:F.serif }}>What we offer</h2>
        <div style={{ display:"grid", gap:"18px" }}>
          {[["Venue curation","Every venue researched with AI-extracted details — palette, ambiance, private dining, proposal suitability scoring."],
            ["Planner directory","Verified planners with specialties, key contacts, price guides, and review summaries. Find the right fit."],
            ["Free consultation","Tell us your vision. A planner responds within 24 hours with a tailored shortlist and preliminary plan."],
            ["End-to-end coordination","Venue booking, flowers, photography, surprise elements, dietary requirements. The details are handled."],
            ["Bilingual service","Full support in English and Chinese, with cultural sensitivity for cross-cultural celebrations."]
          ].map(([t,d],i)=>(
            <div key={i} style={{ paddingBottom:"18px", borderBottom:i<4?"1px solid #eee":"none" }}>
              <div style={{ fontSize:"13px", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", fontFamily:F.sans, marginBottom:"5px" }}>{t}</div>
              <p style={{ margin:0, fontSize:"14px", lineHeight:1.7, color:"#888" }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop:"1px solid #eee", marginTop:"36px", paddingTop:"36px", textAlign:"center" }}>
        <p style={{ margin:"0 0 20px", fontSize:"15px", color:"#888", fontFamily:F.serif, fontStyle:"italic" }}>Ready to plan your moment?</p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={()=>navigate("#/consult")} style={primaryBtn} {...hoverInvert}>Get in touch</button>
          <button onClick={()=>navigate("#/venues")} style={ghostBtn} {...ghostHover}>Browse venues</button>
        </div>
      </div>
    </div>
  </div>;
}

/* ═══════════════════════ APP ═══════════════════════ */
export default function App() {
  const { hash, navigate } = useRouter();
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [hash]);
  let page;
  if(hash.startsWith("#/venue/")) page = <VenueDetailPage id={hash.replace("#/venue/","").split("?")[0]} navigate={navigate} />;
  else if(hash.startsWith("#/venues")) page = <VenuesPage navigate={navigate} />;
  else if(hash.startsWith("#/planner/")) page = <PlannerDetailPage id={hash.replace("#/planner/","").split("?")[0]} navigate={navigate} />;
  else if(hash.startsWith("#/planners")) page = <PlannersPage navigate={navigate} />;
  else if(hash.startsWith("#/consult")) page = <ConsultPage navigate={navigate} />;
  else if(hash.startsWith("#/about")) page = <AboutPage navigate={navigate} />;
  else page = <HomePage navigate={navigate} />;
  return (
    <div style={{ minHeight:"100vh", background:BG, color:"#1a1a1a", fontFamily:F.sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}::selection{background:#1a1a1a;color:#fff}
        input::placeholder,textarea::placeholder{color:#ccc}
        html{scroll-behavior:smooth}body{margin:0}
      `}</style>
      <Nav navigate={navigate} current={hash} />
      {page}
      <Footer navigate={navigate} />
    </div>
  );
}
