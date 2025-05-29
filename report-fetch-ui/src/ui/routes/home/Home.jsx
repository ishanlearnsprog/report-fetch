import {Fragment} from 'react'
import './Home.css'

export function Home() {
    return (
        <Fragment>
            <main className='home'>
                <section className='hero'>
                    <div className='content'>
                        <h1 className='display'>report fetch</h1>
                        <p className='title'>a report extraction tool</p>
                        <div className='container'>
                            <p>Create & Fetch Reports</p>
                        </div>
                    </div>
                </section>
            </main>
        </Fragment>
    )
}
