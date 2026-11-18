import materialSwatches from '@/assets/material-swatches.jpg';

const appearances: Record<string, { tile: number; tint: string; ink: string }> = {
    STEEL: { tile: 0, tint: '#e6eef6', ink: '#273e56' },
    ALUMINIUM: { tile: 1, tint: '#eceff4', ink: '#39465a' },
    COPPER: { tile: 2, tint: '#ffeadc', ink: '#853915' },
    PLASTIC: { tile: 3, tint: '#def6f9', ink: '#125968' },
    RUBBER: { tile: 4, tint: '#eae8ef', ink: '#433951' },
    GLASS: { tile: 5, tint: '#dcf5ef', ink: '#145848' },
    BATTERY: { tile: 6, tint: '#e7f4d9', ink: '#355820' },
    PAPER: { tile: 7, tint: '#faf1da', ink: '#6b4b22' },
    ZINC: { tile: 8, tint: '#e0eff0', ink: '#2a5358' },
    CEMENT: { tile: 9, tint: '#efe9e1', ink: '#594637' },
    ELECTRICITY: { tile: 10, tint: '#fff2cd', ink: '#6f4908' },
    FERTILISER: { tile: 11, tint: '#f0f0d7', ink: '#505820' },
    HYDROGEN: { tile: 12, tint: '#e3edff', ink: '#264b81' },
};

const aliases: Record<string, string> = {
    ALUMINUM: 'ALUMINIUM',
    BATTERIES: 'BATTERY',
    FERTILISERS: 'FERTILISER',
    FERTILIZER: 'FERTILISER',
    FERTILIZERS: 'FERTILISER',
    IRON: 'STEEL',
    PLASTICS: 'PLASTIC',
    TIRE: 'RUBBER',
    TIRES: 'RUBBER',
    TYRE: 'RUBBER',
    TYRES: 'RUBBER',
    WINDSHIELD: 'GLASS',
    WINDSCREEN: 'GLASS',
};

const fallbackSwatches = [appearances.STEEL, appearances.ALUMINIUM, appearances.PLASTIC, appearances.RUBBER];

export default function MaterialBadge({ material }: { material?: string | null }) {
    if (!material?.trim() || material.trim() === '-') {
        return <span className="text-gray-400">-</span>;
    }

    const name = material.trim().toUpperCase();
    const words = name.match(/[A-Z0-9]+/g) ?? [];
    const matches = new Set(words.map(word => appearances[aliases[word] ?? word]).filter(Boolean));
    const fallbackIndex = Array.from(name).reduce(
        (index, character) => (index * 31 + character.charCodeAt(0)) % fallbackSwatches.length,
        0,
    );
    const appearance = matches.size === 1 ? [...matches][0] : fallbackSwatches[fallbackIndex];
    const isPassengerVehicle = /^M[1-3]G?$/.test(name);
    const swatchStyle = isPassengerVehicle
        ? { backgroundImage: `url(${import.meta.env.BASE_URL}evitara.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {
            backgroundImage: `url(${materialSwatches})`,
            backgroundSize: '400% 400%',
            backgroundPosition: `${(appearance.tile % 4) * 100 / 3}% ${Math.floor(appearance.tile / 4) * 100 / 3}%`,
        };

    return (
        <span
            className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-black/10 py-0.5 pl-1 pr-2"
            style={{ backgroundColor: appearance.tint, color: appearance.ink }}
        >
            <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                style={swatchStyle}
            />
            <span className="min-w-0 whitespace-normal break-words text-xs font-semibold leading-4">{material}</span>
        </span>
    );
}

export function MaterialBadges({ material }: { material: string | string[] | null }) {
    const values = Array.isArray(material) ? material : (material ?? '').split(/[,;\n]+/);
    const names = [...new Set(values.map(value => value.trim()).filter(value => value && value !== '-'))];

    if (!names.length) return <MaterialBadge />;

    return (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Materials">
            {names.map(name => (
                <li key={name} className="min-w-0 max-w-full">
                    <MaterialBadge material={name} />
                </li>
            ))}
        </ul>
    );
}
