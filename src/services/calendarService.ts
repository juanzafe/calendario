import { auth, db } from "../firebase/firebase";
import {
	doc,
	onSnapshot,
	deleteDoc,
	collection,
	setDoc,
} from "firebase/firestore";

export async function saveClass(
	day: Date,
	data: { title: string; count: number },
) {
	if (!auth.currentUser) throw new Error("Usuario no autenticado");
	const uid = auth.currentUser.uid;
	const ref = doc(db, "users", uid, "classes", day.toISOString());
	await setDoc(ref, { date: day.toISOString(), ...data });
}

export async function deleteClass(day: Date) {
	if (!auth.currentUser) throw new Error("Usuario no autenticado");
	const uid = auth.currentUser.uid;
	const ref = doc(db, "users", uid, "classes", day.toISOString());
	await deleteDoc(ref);
}

export function listenToClasses(callback: (data: any[]) => void) {
	if (!auth.currentUser) throw new Error("Usuario no autenticado");
	const uid = auth.currentUser.uid;
	const ref = collection(db, "users", uid, "classes");
	return onSnapshot(ref, (snapshot) => {
		const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		callback(data);
	});
}
