import type {Metadata} from 'next';
import { ImportClient } from '../../components/ImportClient';
export const metadata:Metadata={title:'Private scorecard import',description:'Analyze your own canonical cricket match records in your browser.',robots:{index:false,follow:true}};
export default function Page(){return <ImportClient/>}
