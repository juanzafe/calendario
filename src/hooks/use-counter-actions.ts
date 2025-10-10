import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import {
    collection,
    query, where,
} from "firebase/firestore";
import type { Counter } from "../schemas/counter.schema";



export const useCounterActions = () => {

    const {data: user} = useUser();

    

    const db = useFirestore();
    const counterCollectionRef = collection(db, "counters");

    const countersQuery = query(counterCollectionRef,
        where("userId", "==", user!.uid));

    const {status, data:counters} = useFirestoreCollectionData(countersQuery,{
        idField: "id",
        suspense: true
    })

    return {
        counters: counters as Counter[],
        isLoading: status === "loading",
        }
}