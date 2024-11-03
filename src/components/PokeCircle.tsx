import styles from '../styles/pokecircle.module.css'

type PokeCircleProps = {
    setShouldLoad?: (arg: any) => unknown
    alt: string
    src: string
    shiny: boolean
}
export const ShinyCircle = ({position} : { position?: React.CSSProperties['position'] }) => <img alt={"Pokemon is shiny"} style={{position}} className={styles.shiny} src="/shiny.svg" />

const PokeCircle = ({setShouldLoad, alt, src, shiny} : PokeCircleProps) => <div className={styles.pokeImgContainer}>
<img className={styles.pokeImg} onLoad={() => setShouldLoad ? setShouldLoad('loaded') : null}  alt={alt} src={src} />
{shiny && <ShinyCircle />}
</div>


export default PokeCircle