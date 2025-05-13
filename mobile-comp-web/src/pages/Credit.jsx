import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

function Credit(props) {
    let navigate = useNavigate()
    return (<div>
        <Sidebar />
        <div style={{ marginLeft: '200px', padding: '20px' }}>
            <h1>Credit Page</h1>
        </div>
        <p style={{ marginLeft: '100px'}}>
            จิรพิชญ์ แสงพลาย 6434413323
        </p>
        <p style={{ marginLeft: '100px'}}>
            พีรวิชญ์ ศรีสันต์ 6434463723
        </p>
    </div>)
}

export default Credit;