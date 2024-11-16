import React, { useState } from 'react';

const Hadith = () => {
  const [selectedHadith, setSelectedHadith] = useState(null);
  const [hadiths] = useState([
    {
      id: 1, collection: 'Sahih Bukhari', book: 'Faith', number: '1.1.1',
      arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      english: 'Actions are but by intention and every man shall have but that which he intended.',
      narrator: 'Umar ibn Al-Khattab',
      grade: 'Sahih'
    },
    {
      id: 2, collection: 'Sahih Muslim', book: 'Faith', number: '2.16',
      arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
      english: 'None of you truly believes until he loves for his brother what he loves for himself.',
      narrator: 'Anas ibn Malik',
      grade: 'Sahih'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
        <div className="w-16 h-16 bg-gray-700 border-2 border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <i className="fas fa-quote-right text-gold-400 text-2xl"></i>
        </div>
        <h1 className="text-3xl font-heading font-bold text-gold-400 mb-2">
          Hadith Collection
        </h1>
        <p className="text-lg text-gray-300">
          Authentic sayings of Prophet Muhammad ﷺ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-heading font-semibold text-gold-400 mb-6">
            Hadith Collection
          </h2>
          <div className="space-y-4">
            {hadiths.map(hadith => (
              <div
                key={hadith.id}
                onClick={() => setSelectedHadith(hadith)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 
                  ${selectedHadith?.id === hadith.id 
                    ? 'bg-gray-750 border-gold-500' 
                    : 'bg-gray-750 border-gray-600 hover:border-gold-500'}`}
              >
                <h3 className="font-semibold text-gold-400">{hadith.collection}</h3>
                <p className="text-sm text-gray-400">{hadith.book} • {hadith.number}</p>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                  {hadith.english.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          {selectedHadith ? (
            <div>
              <h2 className="text-2xl font-heading font-bold text-gold-400 mb-6 text-center">
                {selectedHadith.collection}
              </h2>
              <div className="bg-gray-750 p-6 rounded-lg border border-gray-600 mb-6">
                <div className="font-arabic text-xl text-center leading-relaxed text-gold-300" dir="rtl">
                  {selectedHadith.arabic}
                </div>
              </div>
              <div className="text-gray-300 leading-7">
                {selectedHadith.english}
              </div>
              <div className="mt-4 p-4 bg-gray-750 rounded-lg border border-gray-700">
                <p className="text-gray-300">
                  <span className="text-gold-400 font-medium">Narrator:</span> {selectedHadith.narrator}
                </p>
                <p className="text-gray-300 mt-2">
                  <span className="text-gold-400 font-medium">Grade:</span> {selectedHadith.grade}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-quote-right text-6xl text-gray-600 mb-4"></i>
              <p className="text-xl text-gray-400">Select a Hadith to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hadith;
