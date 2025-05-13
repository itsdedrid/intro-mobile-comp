import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

function Credit(props) {
    let navigate = useNavigate();
    
    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.content}>
                <h1 style={styles.title}>Credit Page</h1>
                <div style={styles.creditContainer}>
                    <div style={styles.creditInfo}>
                        <p style={styles.creditText}>
                            เดชฤทธิ์ อารยะกิตติพงศ์ <span style={styles.idText}>6434426523</span>
                        </p>
                        <p style={styles.creditText}>
                            พัชรพล โซ๊ะเฮง <span style={styles.idText}>6434455723</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
    },
    content: {
        flex: 1,
        marginLeft: '200px',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f7fa',
    },
    title: {
        fontSize: '36px',
        marginBottom: '20px',
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    creditContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    creditInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    creditText: {
        fontSize: '18px',
        marginBottom: '12px',
        color: '#555',
    },
    idText: {
        fontWeight: 'bold',
        color: '#4CAF50',
    },
};

export default Credit;
