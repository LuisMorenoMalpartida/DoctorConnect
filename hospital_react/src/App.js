import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function App() {
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [metrics, setMetrics] = useState({
        totalPatients: 0,
        costoPromedio: 0,
        edadPromedio: 0,
        tasaReadmision: 0,
    });
    const [chartsData, setChartsData] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [chartFilter, setChartFilter] = useState({ column: '', value: '' });
    const [uniqueOptions, setUniqueOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 20;

    // Lógica para parsear CSV
    const parseCSV = (csv) => {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const row = {};
            headers.forEach((header, i) => {
                row[header] = values[i] ? values[i].trim() : '';
            });
            return row;
        });
        return data;
    };

    // Función para formatear números
    const formatNumber = (num) => {
        return num.toLocaleString('es-ES', { maximumFractionDigits: 2 });
    };

    // Cargar datos y extraer opciones únicas
    useEffect(() => {
        async function fetchCSV() {
            try {
                const response = await fetch('/datos_hospitalarios_100k.csv');
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo CSV.');
                }
                const csvText = await response.text();
                const parsedData = parseCSV(csvText);
                setOriginalData(parsedData);
                setFilteredData(parsedData);

                // Extraer opciones únicas para los combobox
                const generoOptions = [...new Set(parsedData.map(d => d.Género))].filter(Boolean).sort();
                const especialidadOptions = [...new Set(parsedData.map(d => d.Especialidad))].filter(Boolean).sort();
                const condicionOptions = [...new Set(parsedData.map(d => d.Condición))].filter(Boolean).sort();
                const hospitalOptions = [...new Set(parsedData.map(d => d.Hospital))].filter(Boolean).sort();
                const prioridadOptions = [...new Set(parsedData.map(d => d.Prioridad))].filter(Boolean).sort();

                setUniqueOptions({
                    Género: generoOptions,
                    Especialidad: especialidadOptions,
                    Condición: condicionOptions,
                    Hospital: hospitalOptions,
                    Prioridad: prioridadOptions,
                });

            } catch (error) {
                console.error('Error al cargar el archivo:', error);
            }
        }
        fetchCSV();
    }, []);

    const handleChartClick = (column) => (event, element) => {
        if (element.length > 0) {
            const chart = element[0].element.$context.chart;
            const index = element[0].index;
            const value = chart.data.labels[index];
            if (chartFilter.column === column && chartFilter.value === value) {
                setChartFilter({ column: '', value: '' });
            } else {
                setChartFilter({ column, value });
            }
            setSearchTerm('');
            setStartDate('');
            setEndDate('');
        } else {
            setChartFilter({ column: '', value: '' });
        }
    };

    const handleComboboxChange = (e, column) => {
        const value = e.target.value;
        if (value === 'todos') {
            setChartFilter({ column: '', value: '' });
        } else {
            setChartFilter({ column, value });
        }
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    };

    const resetFilters = () => {
        setChartFilter({ column: '', value: '' });
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    };

    useEffect(() => {
        let currentFilteredData = originalData;

        if (chartFilter.column && chartFilter.value) {
            currentFilteredData = currentFilteredData.filter(row => row[chartFilter.column] === chartFilter.value);
        }

        if (startDate && endDate) {
            currentFilteredData = currentFilteredData.filter(row => {
                const rowDate = new Date(row.FechaIngreso);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return !isNaN(rowDate) && !isNaN(start) && !isNaN(end) && rowDate >= start && rowDate <= end;
            });
        }

        if (searchTerm) {
            currentFilteredData = currentFilteredData.filter(row =>
                Object.values(row).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        setFilteredData(currentFilteredData);
        setCurrentPage(1);

        if (currentFilteredData.length > 0) {
            const totalPatients = currentFilteredData.length;
            const totalCost = currentFilteredData.reduce((sum, row) => sum + parseFloat(row.Costo || 0), 0);
            const totalAge = currentFilteredData.reduce((sum, row) => sum + parseInt(row.Edad || 0), 0);
            const readmissionCount = currentFilteredData.filter(row => row.Readmisión === 'Sí').length;

            setMetrics({
                totalPatients: formatNumber(totalPatients),
                costoPromedio: `$${formatNumber(totalCost / totalPatients)}`,
                edadPromedio: formatNumber(totalAge / totalPatients),
                tasaReadmision: `${((readmissionCount / totalPatients) * 100).toFixed(2)}%`,
            });

            const genderCounts = currentFilteredData.reduce((acc, row) => {
                acc[row.Género] = (acc[row.Género] || 0) + 1;
                return acc;
            }, {});

            const ageRanges = { '10-20': 0, '21-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '61-70': 0, '71+': 0 };
            currentFilteredData.forEach(row => {
                const age = parseInt(row.Edad);
                if (age >= 10 && age <= 20) ageRanges['10-20']++;
                else if (age >= 21 && age <= 30) ageRanges['21-30']++;
                else if (age >= 31 && age <= 40) ageRanges['31-40']++;
                else if (age >= 41 && age <= 50) ageRanges['41-50']++;
                else if (age >= 51 && age <= 60) ageRanges['51-60']++;
                else if (age >= 61 && age <= 70) ageRanges['61-70']++;
                else if (age >= 71) ageRanges['71+']++;
            });

            const specialtyData = currentFilteredData.reduce((acc, row) => {
                acc[row.Especialidad] = acc[row.Especialidad] || { totalCost: 0, count: 0 };
                acc[row.Especialidad].totalCost += parseFloat(row.Costo || 0);
                acc[row.Especialidad].count++;
                return acc;
            }, {});
            const specialtyLabels = Object.keys(specialtyData);
            const specialtyCosts = specialtyLabels.map(label => specialtyData[label].totalCost / specialtyData[label].count);

            const hospitalData = currentFilteredData.reduce((acc, row) => {
                acc[row.Hospital] = acc[row.Hospital] || { totalDays: 0, count: 0 };
                acc[row.Hospital].totalDays += parseInt(row.Días_Estancia || 0);
                acc[row.Hospital].count++;
                return acc;
            }, {});
            const hospitalLabels = Object.keys(hospitalData);
            const hospitalStays = hospitalLabels.map(label => hospitalData[label].totalDays / hospitalData[label].count);

            const resultadoCounts = currentFilteredData.reduce((acc, row) => {
                acc[row.Resultado] = (acc[row.Resultado] || 0) + 1;
                return acc;
            }, {});

            const prioridadCounts = currentFilteredData.reduce((acc, row) => {
                acc[row.Prioridad] = (acc[row.Prioridad] || 0) + 1;
                return acc;
            }, {});

            setChartsData({
                genero: { labels: Object.keys(genderCounts), data: Object.values(genderCounts) },
                edad: { labels: Object.keys(ageRanges), data: Object.values(ageRanges) },
                costoEspecialidad: { labels: specialtyLabels, data: specialtyCosts },
                diasEstancia: { labels: hospitalLabels, data: hospitalStays },
                resultado: { labels: Object.keys(resultadoCounts), data: Object.values(resultadoCounts) },
                prioridad: { labels: Object.keys(prioridadCounts), data: Object.values(prioridadCounts) },
            });
        } else {
            setMetrics({ totalPatients: 0, costoPromedio: 0, edadPromedio: 0, tasaReadmision: 0 });
            setChartsData({});
        }

    }, [startDate, endDate, searchTerm, originalData, chartFilter]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setChartFilter({ column: '', value: '' });
    };

    const handleDateChange = (e, type) => {
        if (type === 'start') {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
        setChartFilter({ column: '', value: '' });
    };

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const currentTableData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const renderTable = () => {
        if (filteredData.length === 0) return <p style={{textAlign: 'center'}}>No hay datos disponibles para mostrar con los filtros aplicados.</p>;

        const headers = Object.keys(filteredData[0]);

        return (
            <div style={{ overflowX: 'auto' }}>
                <table id="data-table">
                    <thead>
                        <tr>{headers.map(header => <th key={header}>{header}</th>)}</tr>
                    </thead>
                    <tbody>
                        {currentTableData.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                    <td key={i}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container">
            <header>
                <h1>Dashboard de Análisis Hospitalario 🏥</h1>
                <p>Análisis de 100,000 registros de datos hospitalarios</p>
                <button onClick={resetFilters} style={{
                    marginTop: '15px',
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1em'
                }}>
                    Limpiar Todos los Filtros
                </button>
            </header>

            <main>
                <section className="dashboard-grid">
                    <div className="card">
                        <h3>Total de Pacientes</h3>
                        <div className="metric" id="total-pacientes">{metrics.totalPatients}</div>
                    </div>
                    <div className="card">
                        <h3>Costo Promedio</h3>
                        <div className="metric" id="costo-promedio">{metrics.costoPromedio}</div>
                    </div>
                    <div className="card">
                        <h3>Edad Promedio</h3>
                        <div className="metric" id="edad-promedio">{metrics.edadPromedio}</div>
                    </div>
                    <div className="card">
                        <h3>Tasa de Readmisión</h3>
                        <div className="metric" id="tasa-readmision">{metrics.tasaReadmision}</div>
                    </div>
                </section>

                {/* Nueva sección para todos los filtros */}
                <section className="filters-section">
                    <div className="filters-container">
                        {/* Filtro de Búsqueda de Texto */}
                        <div className="search-input-group">
                            <label htmlFor="searchInput">Buscar:</label>
                            <input
                                type="text"
                                id="searchInput"
                                placeholder="Buscar en la tabla..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Filtros de Fecha */}
                        <div className="date-filter-group">
                            <label htmlFor="startDate">Fecha de Inicio:</label>
                            <input type="date" id="startDate" value={startDate} onChange={e => handleDateChange(e, 'start')} />
                        </div>
                        <div className="date-filter-group">
                            <label htmlFor="endDate">Fecha de Fin:</label>
                            <input type="date" id="endDate" value={endDate} onChange={e => handleDateChange(e, 'end')} />
                        </div>

                        {/* Comboboxes de Filtros */}
                        <div className="select-filter-group">
                            <label htmlFor="genderFilter">Género:</label>
                            <select id="genderFilter" value={chartFilter.column === 'Género' ? chartFilter.value : 'todos'} onChange={(e) => handleComboboxChange(e, 'Género')}>
                                <option value="todos">Todos los géneros</option>
                                {uniqueOptions.Género && uniqueOptions.Género.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="select-filter-group">
                            <label htmlFor="specialtyFilter">Especialidad:</label>
                            <select id="specialtyFilter" value={chartFilter.column === 'Especialidad' ? chartFilter.value : 'todos'} onChange={(e) => handleComboboxChange(e, 'Especialidad')}>
                                <option value="todos">Todas las especialidades</option>
                                {uniqueOptions.Especialidad && uniqueOptions.Especialidad.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="select-filter-group">
                            <label htmlFor="conditionFilter">Condición:</label>
                            <select id="conditionFilter" value={chartFilter.column === 'Condición' ? chartFilter.value : 'todos'} onChange={(e) => handleComboboxChange(e, 'Condición')}>
                                <option value="todos">Todas las condiciones</option>
                                {uniqueOptions.Condición && uniqueOptions.Condición.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="select-filter-group">
                            <label htmlFor="hospitalFilter">Hospital:</label>
                            <select id="hospitalFilter" value={chartFilter.column === 'Hospital' ? chartFilter.value : 'todos'} onChange={(e) => handleComboboxChange(e, 'Hospital')}>
                                <option value="todos">Todos los hospitales</option>
                                {uniqueOptions.Hospital && uniqueOptions.Hospital.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="select-filter-group">
                            <label htmlFor="priorityFilter">Prioridad:</label>
                            <select id="priorityFilter" value={chartFilter.column === 'Prioridad' ? chartFilter.value : 'todos'} onChange={(e) => handleComboboxChange(e, 'Prioridad')}>
                                <option value="todos">Todas las prioridades</option>
                                {uniqueOptions.Prioridad && uniqueOptions.Prioridad.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>


                <section className="chart-section">
                    <div className="chart-container">
                        <h3>Pacientes por Género</h3>
                        {chartsData.genero && <Pie
                            data={{
                                labels: chartsData.genero.labels,
                                datasets: [{ data: chartsData.genero.data, backgroundColor: ['#007bff', '#28a745', '#ffc107'] }]
                            }}
                            options={{ onClick: handleChartClick('Género') }}
                        />}
                    </div>
                    <div className="chart-container">
                        <h3>Distribución de Pacientes por Edad</h3>
                        {chartsData.edad && <Bar
                            data={{
                                labels: chartsData.edad.labels,
                                datasets: [{ label: 'Número de Pacientes', data: chartsData.edad.data, backgroundColor: '#17a2b8' }]
                            }}
                            options={{ onClick: handleChartClick('Edad'), scales: { y: { beginAtZero: true } } }}
                        />}
                    </div>
                    <div className="chart-container">
                        <h3>Costo Promedio por Especialidad</h3>
                        {chartsData.costoEspecialidad && <Bar
                            data={{
                                labels: chartsData.costoEspecialidad.labels,
                                datasets: [{ label: 'Costo Promedio', data: chartsData.costoEspecialidad.data, backgroundColor: '#dc3545' }]
                            }}
                            options={{ onClick: handleChartClick('Especialidad'), scales: { y: { beginAtZero: true } } }}
                        />}
                    </div>
                    <div className="chart-container">
                        <h3>Días de Estancia Promedio por Hospital</h3>
                        {chartsData.diasEstancia && <Bar
                            data={{
                                labels: chartsData.diasEstancia.labels,
                                datasets: [{ label: 'Días de Estancia Promedio', data: chartsData.diasEstancia.data, backgroundColor: '#6c757d' }]
                            }}
                            options={{ onClick: handleChartClick('Hospital'), scales: { y: { beginAtZero: true } } }}
                        />}
                    </div>
                    <div className="chart-container">
                        <h3>Resultados de Tratamiento</h3>
                        {chartsData.resultado && <Doughnut
                            data={{
                                labels: chartsData.resultado.labels,
                                datasets: [{ data: chartsData.resultado.data, backgroundColor: ['#28a745', '#ffc107', '#dc3545'] }]
                            }}
                            options={{ onClick: handleChartClick('Resultado') }}
                        />}
                    </div>
                    <div className="chart-container">
                        <h3>Prioridad de Casos</h3>
                        {chartsData.prioridad && <Bar
                            data={{
                                labels: chartsData.prioridad.labels,
                                datasets: [{ label: 'Número de Casos', data: chartsData.prioridad.data, backgroundColor: '#007bff' }]
                            }}
                            options={{ onClick: handleChartClick('Prioridad'), scales: { y: { beginAtZero: true } } }}
                        />}
                    </div>
                </section>

                <section className="data-table-section">
                    <h2>Datos Detallados de Pacientes</h2>
                    {renderTable()}
                    <div className="pagination">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                        <span id="pageInfo">Página {currentPage} de {totalPages}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages}>Siguiente</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
