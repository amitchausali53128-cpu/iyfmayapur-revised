import { useState } from 'react'
import centerImage from '/sample.jpg'
import './map.css'

const centers = [
    { name: 'Mayapur Base', place: 'NIT Durgapur', address: 'NIT Durgapur, West Bengal', contact: '+91 70475 82554', position: 'map-marker--mayapur', crop: 'center' },
    { name: 'Shantipur Base', place: 'NIT Silchar', address: 'NIT Silchar, Assam', contact: '+91 75868 70952', position: 'map-marker--kolkata', crop: '35% center' },
    { name: 'Bolpur Shantiniketan Base', place: 'Bolpur', address: 'Bolpur, West Bengal', contact: '+91 70470 51551', position: 'map-marker--nadia', crop: '65% center' },
    { name: 'Brihad Mrdanga Base', place: 'Bardhaman', address: 'Bardhaman, West Bengal', contact: '+91 70475 82554', position: 'map-marker--prerna', crop: '20% center' },
    { name: 'Simantadwipa Base', place: 'Phuljohor, BCREC', address: 'Phuljohor, BCREC, West Bengal', contact: '+91 70475 82554', position: 'map-marker--students', crop: '80% center' },
    { name: 'Koladwipa Base', place: 'IIIT Kalyani', address: 'IIIT Kalyani, West Bengal', contact: '+91 78119 04445', position: 'map-marker--vedic', crop: '50% center' },
]

export default function Map() {
    const [selectedCenter, setSelectedCenter] = useState(null)
    const activeCenter = selectedCenter === null ? null : centers[selectedCenter]

    const openCenter = (index) => setSelectedCenter(index)
    const closeDrawer = () => setSelectedCenter(null)

    return (
        <section className="map-section" aria-labelledby="map-heading">
            <div className="map-section__intro">
                <p className="map-section__eyebrow">Six places, one shared spirit</p>
                <h2 id="map-heading">Visit us Here</h2>
                <p>
                    Find a community to learn with, serve with, and grow alongside.
                </p>
            </div>

            <div className="map-section__content">
                
                <div className="map-visual" aria-label="Map showing six IYF community centers">
                    <div className="map-visual__wash" />
                    <div className="map-route map-route--north" />
                    <div className="map-route map-route--south" />
                    <div className="map-route map-route--east" />
                    <span className="map-region map-region--one">BENGAL</span>
                    <span className="map-region map-region--two">GANGES BELT</span>

                    {centers.map((center, index) => (
                        <button
                            className={`map-marker ${center.position} ${selectedCenter === index ? 'is-active' : ''}`}
                            key={center.name}
                            onClick={() => openCenter(index)}
                            aria-label={`View details for ${center.name}`}
                            aria-pressed={selectedCenter === index}
                        >
                            <span className="map-marker__pulse" />
                            <span className="map-marker__balloon">
                                <img src={centerImage} alt="" style={{ objectPosition: center.crop }} />
                                <strong>{center.name}</strong>
                            </span>
                            <span className="map-marker__dot">{index + 1}</span>
                        </button>
                    ))}
                </div>
            </div>

            {activeCenter && (
                <>
                    <button className="map-drawer__backdrop" onClick={closeDrawer} aria-label="Close center details" />
                    <aside className="map-drawer" aria-label={`${activeCenter.name} details`}>
                        <button className="map-drawer__close" onClick={closeDrawer} aria-label="Close center details">×</button>
                        <div className="map-detail__image-wrap">
                            <img src={centerImage} alt={`${activeCenter.name} community`} style={{ objectPosition: activeCenter.crop }} />
                            <span className="map-detail__tag">IYF COMMUNITY</span>
                        </div>
                        <div className="map-detail__body">
                            <p className="map-detail__eyebrow">Currently exploring</p>
                            <h3>{activeCenter.name}</h3>
                            <p className="map-detail__place">{activeCenter.place}</p>
                            <div className="map-detail__meta">
                                <p><span aria-hidden="true">⌖</span>{activeCenter.address}</p>
                                <p><span aria-hidden="true">◌</span>{activeCenter.contact}</p>
                            </div>
                            <a href={`tel:${activeCenter.contact.replaceAll(' ', '')}`} className="map-detail__link">Connect with this centre <span aria-hidden="true">↗</span></a>
                        </div>
                    </aside>
                </>
            )}
        </section>
    )
}