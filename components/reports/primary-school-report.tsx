export const PrimarySchoolReport = () => {
    return (
        <div className="min-h-screen bg-stone-100 p-5 font-sans text-sm text-black">
            <div className="mx-auto max-w-4xl border-[3px] border-black bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-black px-6 py-6">
                    <div className="flex h-20 w-36 items-center justify-center border-2 border-dashed border-gray-300 text-xs text-gray-400">
                        Logo
                    </div>
                    <div className="mx-6 flex flex-1 flex-col items-center text-center">
                        <div className="text-xl font-bold text-amber-800">
                            MALAIKA INTERNATIONAL SCHOOL
                        </div>
                        <div className="mt-1 text-xs leading-relaxed">
                            CAMBRIDGE AND PURE FRENCH PROGRAMS
                            <br />
                            malaika.int.school@gmail.com
                            <br />
                            Phone: +250 788 532 632
                        </div>
                    </div>
                    <div className="flex h-20 w-36 items-center justify-center border-2 border-dashed border-gray-300 text-xs text-gray-400">
                        Cambridge Assessment
                    </div>
                </div>

                {/* Student Info */}
                <div className="flex justify-between border-b-2 border-black bg-stone-50 px-6 py-4">
                    <div>
                        <span className="font-semibold">Nom et Prenom:</span> Niyigaba Beni Noriah
                    </div>
                    <div>
                        <span className="font-semibold">Mi-trimestre, 2025-26</span>
                    </div>
                </div>
                <div className="flex justify-between border-b-2 border-black bg-stone-50 px-6 py-4">
                    <div>
                        <span className="font-semibold">Classe:</span> GRANDE SECTION (GS)
                    </div>
                </div>

        {/* Title */}
        <div className="border-b-2 border-black py-3 text-center text-base font-semibold">
            BULLETIN DU MI-TRIMESTRE
        </div>

        {/* Grades Table */}
        <div className="p-6">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-amber-200">
                        <th className="border border-black px-4 py-3 text-left font-semibold">
                            COURS
                        </th>
                        <th className="border border-black px-4 py-3 text-center font-semibold">
                            MAXIMUM
                        </th>
                        <th className="border border-black px-4 py-3 text-center font-semibold">
                            POINTS OBTENUS
                        </th>
                        <th className="border border-black px-4 py-3 text-center font-semibold">
                            MENTION
                        </th>
                        <th className="border border-black px-4 py-3 text-left font-semibold">
                            COMMENTAIRES
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        ['Apprendre à vivre ensemble', '10', '5', 'C', 'BIEN'],
                        ['Mobiliser le langage oral', '10', '7', 'B', 'TRÈS BIEN'],
                        ['Mobiliser le langage écrit', '10', '4', 'D', 'PASSABLE'],
                        ['Outils Mathématiques', '10', '9', 'A', 'EXCELLENT'],
                        ['Explorer le monde', '10', '5', 'C', 'BIEN'],
                        ['Activités Physiques', '10', '4', 'D', 'PASSABLE'],
                        ['Activités Artistiques', '10', '3', 'D', 'PASSABLE'],
                        ['Anglais', '10', '8', 'B', 'TRÈS BIEN'],
                    ].map(([course, max, points, mention, comment]) => (
                        <tr key={course} className="bg-white">
                            <td className="border border-black px-4 py-3 font-normal">{course}</td>
                            <td className="border border-black px-4 py-3 text-center">{max}</td>
                            <td className="border border-black px-4 py-3 text-center">{points}</td>
                            <td className="border border-black px-4 py-3 text-center">{mention}</td>
                            <td className="border border-black px-4 py-3">{comment}</td>
                        </tr>
                    ))}
                    <tr className="bg-stone-50 font-semibold">
                        <td className="border border-black px-4 py-3">
                            <strong>Percentage</strong>
                        </td>
                        <td className="border border-black px-4 py-3 text-center">
                            <strong>56.2%</strong>
                        </td>
                        <td className="border border-black px-4 py-3" colSpan={3} />
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Code Section */}
        <div className="flex gap-10 border-t-2 border-black px-6 py-4 text-xs leading-6">
            <div>
                <strong>Code</strong>
            </div>
            <div>
                A: EXCELLENT (9-10)
                <br />
                B: TRÈS BIEN (7-8)
            </div>
            <div>
                C: BIEN (5-6)
                <br />
                D: PASSABLE (0-4)
            </div>
        </div>

        {/* Teacher Section */}
        <div className="border-t-2 border-black px-6 py-6">
            <div className="text-sm">
                Titulaire de la classe: MAPENDO MIRINDI PASCALINE
            </div>
            <div className="mt-4 flex h-16 w-52 items-center justify-center border-2 border-dashed border-gray-300 text-xs text-gray-400">
                Signature
            </div>
        </div>

        {/* Footer */}
        <div className="flex items-start justify-between border-t-2 border-black px-6 py-6">
            <div className="flex-1">
                <div className="text-sm font-semibold">
                    DIRECTEUR: UGIRAMAHORO ISSA
                </div>
                <div className="text-sm font-semibold">
                    SIGNATURE ET CACHET DE L&apos;ÉCOLE
                </div>
                <div className="mt-4 flex h-16 w-52 items-center justify-center border-2 border-dashed border-gray-300 text-xs text-gray-400">
                    Signature
                </div>
            </div>
            <div className="ml-6 flex h-24 w-40 items-center justify-center border-2 border-dashed border-gray-300 px-4 text-center text-[11px] text-gray-400">
                MALAIKA INTERNATIONAL SCHOOL
                <br />
                TEL: 0788532632
                <br />
                B.P 7483
                <br />
                KIGALI - RWANDA
            </div>
        </div>
    </div>
</div>
);
};

export default PrimarySchoolReport;