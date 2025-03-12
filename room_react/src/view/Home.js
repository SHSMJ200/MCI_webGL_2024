import React from 'react';
import './Home.css'

const Home = () => {
    return (
        <section className="login_box">
            <div>
                <label className="login_label" htmlFor="username">Username </label>
                <input type="text" placeholder="username" defaultValue="" />
            </div>
            <div>
                <label className="login_label" htmlFor="password">Password </label>
                <input type="text" defaultValue="" placeholder="password" />
            </div>
            <button>Sign In</button>
            <button>Sign Up</button>
        </section>
    );
};

export default Home;