import React, { useState } from 'react'

const Guides = () => {
  const [selectedGuide, setSelectedGuide] = useState(null)

  const guides = [
    {
      id: 'ramadan',
      title: 'The Sacred Month of Ramadan',
      icon: 'fas fa-moon',
      color: 'burgundy',
      sections: [
        {
          title: 'Preparation and Intention',
          content: 'Begin Ramadan with sincere intention (niyyah) for fasting. Prepare spiritually by increasing prayers, reading Quran, and seeking forgiveness. Make dua for a blessed month ahead.'
        },
        {
          title: 'Sehri - The Pre-Dawn Meal',
          content: 'Wake up before Fajr for Sehri. Eat nutritious foods including dates, water, and wholesome meals. Remember to make intention for fasting before Fajr prayer time.'
        },
        {
          title: 'Fasting Etiquette and Dua',
          content: 'During fasting, avoid all food, drink, and intimate relations from dawn to sunset. Maintain good character, avoid arguments, and increase remembrance of Allah.'
        },
        {
          title: 'Iftari - Breaking the Fast',
          content: 'Break your fast at sunset with dates and water, following the Sunnah. Make dua before breaking fast. Share Iftari with family and invite others to join.'
        },
        {
          title: 'Tarawih and Night Prayers',
          content: 'Perform Tarawih prayers after Isha. These special Ramadan prayers help complete the Quran over the month. Increase voluntary prayers and night worship.'
        },
        {
          title: 'Laylatul Qadr - The Night of Power',
          content: 'Seek Laylatul Qadr in the last 10 odd nights of Ramadan. This night is better than 1000 months. Increase prayers, Quran recitation, and dua for forgiveness.'
        }
      ]
    },
    {
      id: 'hajj',
      title: 'Pilgrimage to the Sacred House',
      icon: 'fas fa-kaaba',
      color: 'gold',
      sections: [
        {
          title: 'Spiritual Preparation',
          content: 'Prepare your heart and mind for Hajj. Seek knowledge about the rituals, make sincere repentance, and settle all debts and disputes before departure.'
        },
        {
          title: 'Ihram - The Sacred State',
          content: 'Enter the state of Ihram before crossing the Miqat. Wear the prescribed white garments for men, make intention for Hajj, and begin reciting Talbiyah.'
        },
        {
          title: 'Tawaf - Circumambulation',
          content: 'Perform Tawaf around the Holy Kaaba seven times, starting from the Black Stone. Maintain humility and remember Allah throughout the ritual.'
        },
        {
          title: "Sa'i - The Walk of Faith",
          content: "Complete Sa'i between Safa and Marwah hills seven times, commemorating Hajar's search for water for Prophet Ismail (AS). Make dua during this ritual."
        },
        {
          title: 'Standing at Arafat',
          content: 'Stand at the plains of Arafat on the 9th of Dhul Hijjah. This is the most important pillar of Hajj. Spend the day in prayer, supplication, and remembrance of Allah.'
        },
        {
          title: 'Symbolic Stoning',
          content: 'Throw pebbles at the three pillars in Mina, symbolically rejecting Satan. Follow the Sunnah method and maintain safety during this ritual.'
        },
        {
          title: 'Farewell Tawaf',
          content: 'Perform the farewell Tawaf before leaving Mecca. This is the final ritual of Hajj, bidding farewell to the Sacred House with a heavy heart.'
        }
      ]
    },
    {
      id: 'namaz',
      title: 'The Daily Prayer - Salah',
      icon: 'fas fa-pray',
      color: 'royal',
      sections: [
        {
          title: 'Purification - Wudu',
          content: 'Begin with Wudu (ablution). Wash hands, rinse mouth and nose, wash face, arms, wipe head, and wash feet. Maintain ritual purity before prayer.'
        },
        {
          title: 'Facing the Qibla',
          content: 'Face towards the Kaaba in Mecca for prayer. Use a compass or Qibla app to find the correct direction. Ensure your prayer area is clean and pure.'
        },
        {
          title: 'Prayer Postures',
          content: 'Learn the proper positions: standing (Qiyam), bowing (Ruku), prostration (Sujud), and sitting (Jalsa). Each position has specific duas and etiquettes.'
        },
        {
          title: 'Recitation Order',
          content: 'Begin with Takbir, recite Al-Fatiha and another surah, perform Ruku and Sujud with proper dhikr. Follow the sequence for each prayer time.'
        },
        {
          title: 'Five Daily Prayers',
          content: 'Perform Fajr (2 rakats), Dhuhr (4), Asr (4), Maghrib (3), and Isha (4) prayers. Each prayer has its blessed time and specific benefits.'
        },
        {
          title: 'Congregational Prayer',
          content: 'Pray in congregation when possible, especially for men. Friday Jumma prayer is obligatory. Follow the Imam and maintain proper rows.'
        }
      ]
    },
    {
      id: 'wudu',
      title: 'Ablution - The Path to Purity',
      icon: 'fas fa-hands-wash',
      color: 'emerald',
      sections: [
        {
          title: 'Intention and Bismillah',
          content: 'Begin Wudu with sincere intention (niyyah) to purify yourself for prayer. Say "Bismillah" (In the name of Allah) before starting the ablution.'
        },
        {
          title: 'Washing Hands',
          content: 'Wash both hands up to the wrists three times, ensuring water reaches between fingers. Start with the right hand, then the left hand.'
        },
        {
          title: 'Rinsing Mouth',
          content: 'Rinse your mouth three times with clean water, using your right hand. Gargle gently and spit out the water completely.'
        },
        {
          title: 'Cleaning Nose',
          content: 'Sniff water into the nostrils three times with your right hand, then blow it out using your left hand. Clean the nostrils thoroughly.'
        },
        {
          title: 'Washing Face',
          content: 'Wash your entire face three times from forehead to chin and from ear to ear. Ensure water covers the whole face area including the beard.'
        },
        {
          title: 'Washing Arms',
          content: 'Wash your right arm from fingertips to elbow three times, then the left arm. Ensure water reaches all parts including between fingers.'
        },
        {
          title: 'Wiping Head',
          content: 'Wipe your head once with wet hands from front to back, then back to front. Include the ears by wiping inside with index fingers and outside with thumbs.'
        },
        {
          title: 'Washing Feet',
          content: 'Wash the right foot up to the ankle three times, then the left foot. Clean between toes and ensure water covers the entire foot area.'
        },
        {
          title: 'Final Dua',
          content: 'After completing Wudu, recite the dua: "Ashhadu alla ilaha illa Allah wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluh."'
        }
      ]
    }
  ]

  const getColorClasses = (color) => {
    const colorMap = {
      burgundy: 'bg-gradient-to-br from-burgundy-100 to-burgundy-200 border-burgundy-400 text-burgundy-800',
      gold: 'bg-gradient-to-br from-gold-100 to-amber-100 border-gold-400 text-royal-800',
      royal: 'bg-gradient-to-br from-royal-100 to-royal-200 border-royal-400 text-royal-800',
      emerald: 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-400 text-emerald-800'
    }
    return colorMap[color] || colorMap.gold
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="ancient-card p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-royal-500 to-royal-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i className="fas fa-book text-white text-3xl"></i>
        </div>
        <h1 className="text-4xl font-heading font-bold text-royal-800 mb-2">
          Islamic Guides
        </h1>
        <p className="text-xl text-gold-600">
          Step-by-step guidance for Islamic practices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guide Selection */}
        <div className="space-y-4">
          {guides.map(guide => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className={`ancient-card p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedGuide?.id === guide.id ? 'ring-4 ring-gold-400' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  guide.color === 'burgundy' ? 'bg-gradient-to-br from-burgundy-500 to-burgundy-700' :
                  guide.color === 'gold' ? 'bg-gradient-to-br from-gold-500 to-gold-700' :
                  guide.color === 'royal' ? 'bg-gradient-to-br from-royal-500 to-royal-700' :
                  'bg-gradient-to-br from-emerald-500 to-emerald-700'
                }`}>
                  <i className={`${guide.icon} text-white text-2xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-semibold text-royal-800 mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {guide.sections.length} sections • Complete guide
                  </p>
                </div>
                <div className="text-gold-600">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guide Content */}
        <div className="ancient-card p-6">
          {selectedGuide ? (
            <div>
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  selectedGuide.color === 'burgundy' ? 'bg-gradient-to-br from-burgundy-500 to-burgundy-700' :
                  selectedGuide.color === 'gold' ? 'bg-gradient-to-br from-gold-500 to-gold-700' :
                  selectedGuide.color === 'royal' ? 'bg-gradient-to-br from-royal-500 to-royal-700' :
                  'bg-gradient-to-br from-emerald-500 to-emerald-700'
                }`}>
                  <i className={`${selectedGuide.icon} text-white text-3xl`}></i>
                </div>
                <h2 className="text-3xl font-heading font-bold text-royal-800 mb-4">
                  {selectedGuide.title}
                </h2>
              </div>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                {selectedGuide.sections.map((section, index) => (
                  <div key={index} className={`p-6 rounded-lg border-2 ${getColorClasses(selectedGuide.color)}`}>
                    <h3 className="text-xl font-heading font-semibold mb-3">
                      {index + 1}. {section.title}
                    </h3>
                    <p className="leading-7 text-gray-700">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  May Allah accept your efforts and grant you success in following these teachings.
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    <i className="fas fa-bookmark mr-2"></i>
                    Save Guide
                  </button>
                  <button className="px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg transition-colors">
                    <i className="fas fa-share mr-2"></i>
                    Share
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <i className="fas fa-book text-6xl text-gold-300 mb-6"></i>
              <h3 className="text-2xl font-heading font-semibold text-royal-800 mb-4">
                Select a Guide
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Choose from our comprehensive Islamic guides to learn step-by-step practices
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="p-3 bg-gold-50 rounded-lg border border-gold-300">
                  <i className="fas fa-moon text-burgundy-600 mb-2"></i>
                  <p><strong>Ramadan</strong><br/>Fasting & spiritual practices</p>
                </div>
                <div className="p-3 bg-gold-50 rounded-lg border border-gold-300">
                  <i className="fas fa-kaaba text-gold-600 mb-2"></i>
                  <p><strong>Hajj & Umrah</strong><br/>Pilgrimage rituals</p>
                </div>
                <div className="p-3 bg-gold-50 rounded-lg border border-gold-300">
                  <i className="fas fa-pray text-royal-600 mb-2"></i>
                  <p><strong>Daily Prayers</strong><br/>Salah guide</p>
                </div>
                <div className="p-3 bg-gold-50 rounded-lg border border-gold-300">
                  <i className="fas fa-hands-wash text-emerald-600 mb-2"></i>
                  <p><strong>Ablution</strong><br/>Wudu steps</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Guides
