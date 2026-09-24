import { useState } from 'react'
import centerImage from '/sample.jpg'
import './map.css'

const centers = [
    { name: 'Mayapur Campus', place: 'Sridham Mayapur', address: 'BACE Campus, Mayapur, Nadia, West Bengal', contact: '+91 90070 10001', position: 'map-marker--mayapur', crop: 'center' },
    { name: 'Kolkata Hub', place: 'Kolkata', address: 'Salt Lake, Kolkata, West Bengal', contact: '+91 90070 10002', position: 'map-marker--kolkata', crop: '35% center' },
    { name: 'Nadia Zone', place: 'Nadia', address: 'Nabadwip Road, Nadia, West Bengal', contact: '+91 90070 10003', position: 'map-marker--nadia', crop: '65% center' },
    { name: 'Prerna Zone', place: 'West Bengal', address: 'Prerna Community Hall, West Bengal', contact: '+91 90070 10004', position: 'map-marker--prerna', crop: '20% center' },
    { name: 'Students Centre', place: 'Kalyani', address: 'University Area, Kalyani, West Bengal', contact: '+91 90070 10005', position: 'map-marker--students', crop: '80% center' },
    { name: 'Vedic Centre', place: 'Krishnanagar', address: 'College Road, Krishnanagar, West Bengal', contact: '+91 90070 10006', position: 'map-marker--vedic', crop: '50% center' },
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