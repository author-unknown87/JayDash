import banner from '../../assets/HomeBanner.jpg';
import styles from './Home.module.scss';

export default function HomePage() {
    return (
        <>
            <div className={styles.BannerImage}><img src={banner} /></div>
            <div className={styles.Content}>
                <h1>My name is Joshua Gravatt</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit erat metus, vitae tincidunt lacus rhoncus ac. Donec sit amet commodo urna. Phasellus tincidunt pellentesque turpis nec gravida. Suspendisse vitae orci tortor. Ut eu molestie quam. Donec laoreet leo auctor consectetur molestie. Donec efficitur, augue sit amet suscipit placerat, nulla turpis consequat odio, et interdum tellus leo in neque. Proin sed tempor ante. In orci massa, pharetra vel pharetra nec, suscipit a neque. Etiam justo sem, vulputate finibus est eu, tempor lacinia ex. Suspendisse in tellus enim. Ut aliquet metus eros, hendrerit consectetur felis posuere eget. Fusce scelerisque scelerisque quam sagittis tristique.

Quisque placerat erat eget risus pretium, sit amet maximus nulla facilisis. Nullam maximus erat ac arcu fringilla, rhoncus convallis ipsum aliquet. Fusce laoreet tempus laoreet. Sed interdum, purus eu luctus volutpat, augue mauris fermentum justo, eget lobortis arcu justo ut ex. Nullam laoreet quis ante sit amet porttitor. Fusce id ultrices nibh. Ut porta lorem aliquam lectus consequat, id fermentum ligula facilisis. Nam tristique efficitur felis, accumsan aliquam dui elementum a.</p>
            </div>
        </>
    )
}