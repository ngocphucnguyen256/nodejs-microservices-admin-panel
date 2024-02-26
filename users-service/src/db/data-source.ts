import { DataSource } from 'typeorm';
import ormConfig from '../config/ormConfig';

const dataSource = new DataSource(ormConfig);

// Wrap initialization in an async function
export async function initDataSources() {
  await dataSource.initialize();
}

export default dataSource;