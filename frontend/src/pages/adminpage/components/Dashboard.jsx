import IncomeComputer from '../../../utils/IncomeComputer';
import useAppData from '../../../modules/useAdmin';

const Dashboard = () => {
    const { data } = useAppData();
    const income = IncomeComputer();
    return (
        <div className='dashboard-container'>
            <h1>Dashboard</h1>
            <div className="title-card-container">
                <div className="title-card">
                    <div>
                        <h3>Total Clients</h3>
                        <small>increase</small>
                    </div>
                    <p>{data?.clients?.length || 0}</p>
                </div>
                <div className="title-card">
                    <div>
                        <h3>Orders made</h3>
                        <small>increase</small>
                    </div>
                    <p>{data?.orders?.length || 0}</p>
                </div>
                <div className="title-card">
                    <div>
                        <h3>Total Income</h3>
                        <small>increase</small>
                    </div>
                    <p>${data?.income || income}</p>
                </div>
            </div>
            
        </div>
    );
}

export default Dashboard;
