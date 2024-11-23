const S3_BUCKET_URL = 'https://poketrade.s3.eu-west-1.amazonaws.com/pokes/';
const App = () => {
    const [pokemonData, setPokemonData] = React.useState([]);
    const [modifiedData, setModifiedData] = React.useState([]);

    React.useEffect(() => {
        // Load JSON data from the local file
        fetch('filteredArrayWithShiny.json')
        .then(response => response.json())
        .then(data => {
            setPokemonData(data);
            setModifiedData(
            data.map((item) => {
                if (Array.isArray(item)) { // Ensure item is an array before destructuring
                const [PokemonName, PokemonNumber, CP, ShadowPokemon, ImageId, CaptureDate, ShinyOutput] = item;
                return {
                    PokemonName,
                    PokemonNumber,
                    CP,
                    ShadowPokemon,
                    ImageId,
                    CaptureDate,
                    ShinyOutput,
                    isShiny: ShinyOutput >= 0.99, // Initial shiny status based on ShinyOutput
                    excludeImage: false           // Default exclude status
                };
                } else {
                console.error("Unexpected data format:", item);
                return null;
                }
            }).filter(item => item !== null) // Remove any null entries caused by unexpected formats
            );
        })
        .catch(error => console.error('Error loading JSON data:', error));
    }, []);

    const handleExport = () => {
        const outputContainer = document.getElementById('output');
        outputContainer.textContent = JSON.stringify(modifiedData, null, 2);
    };

    // Group data by species for display, excluding those with ShinyOutput of 0 or 1
    const filteredGroupedData = modifiedData.reduce((acc, item) => {
        if (item.ShinyOutput !== 0 && item.ShinyOutput !== 1) { // Filter condition for display
            const { PokemonNumber, PokemonName } = item;
            if (!acc[PokemonNumber]) acc[PokemonNumber] = [];
            acc[PokemonNumber].push(item);
        }
        return acc;
    }, {});

    return React.createElement(
        'div',
        { className: 'App' },
        React.createElement(
            'button',
            { className: 'sticky-button', onClick: handleExport },
            'Export Data'
        ),
        Object.keys(filteredGroupedData).map(pokemonNumber => 
            React.createElement(SpeciesSection, {
                key: pokemonNumber,
                speciesData: filteredGroupedData[pokemonNumber],
                pokemonName: filteredGroupedData[pokemonNumber][0].PokemonName
            })
        ),
        React.createElement('div', { id: 'output', className: 'output-container' })
    );
};

const SpeciesSection = ({ speciesData, pokemonName }) => {
    return React.createElement(
        'div',
        { className: 'species-section' },
        React.createElement('h2', null, `${pokemonName} (Species ID: ${speciesData[0].PokemonNumber})`),
        React.createElement(
            'div',
            { className: 'images-container' },
            speciesData.map((pokemon, index) => 
                React.createElement(PokemonImage, { key: index, pokemon })
            )
        )
    );
};

const PokemonImage = ({ pokemon }) => {
    const [isShiny, setIsShiny] = React.useState(pokemon.isShiny);
    const [excludeImage, setExcludeImage] = React.useState(pokemon.excludeImage);
    const [isVisible, setIsVisible] = React.useState(false);
    const imageRef = React.useRef(null);

    React.useEffect(() => {
        // Intersection Observer to check if the image is in view
        const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once the image is loaded
            }
        },
        { threshold: 0.1 }
        );
        if (imageRef.current) observer.observe(imageRef.current);
        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        // Update the modified data with shiny/exclude changes
        pokemon.isShiny = isShiny;
        pokemon.excludeImage = excludeImage;
    }, [isShiny, excludeImage]);

    return React.createElement(
        'div',
        { className: 'pokemon-image', ref: imageRef },
        isVisible
        ? React.createElement('img', {
            src: `${S3_BUCKET_URL}${pokemon.ImageId}.png`,
            alt: pokemon.PokemonName,
            width: 100
            })
        : React.createElement('div', { className: 'placeholder' }, 'Loading...'),
        React.createElement('div', null, `${pokemon.ImageId}`),
        React.createElement('div', null, `${pokemon.ShinyOutput}`),
        React.createElement(
            'label',
            null,
            React.createElement('input', {
                type: 'checkbox',
                checked: isShiny,
                onChange: () => setIsShiny(!isShiny)
            }),
            ' Mark as Shiny'
        ),
        React.createElement(
            'label',
            null,
            React.createElement('input', {
                type: 'checkbox',
                checked: excludeImage,
                onChange: () => setExcludeImage(!excludeImage)
            }),
            ' Exclude this Image'
        )
    );
};

// Render the app
ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
);

// lmao tfw no jsx