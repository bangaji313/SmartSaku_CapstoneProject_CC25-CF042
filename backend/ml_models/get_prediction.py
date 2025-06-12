import tensorflow as tf
import numpy as np
import pickle
import sys
import os

# --- Muat semua artifak yang dibutuhkan ---
try:
    # Menggunakan path absolut untuk memastikan file ditemukan
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'model_prediksi.h5')
    scaler_path = os.path.join(base_dir, 'scaler_prediksi.pkl')

    model = tf.keras.models.load_model(model_path)
    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)
    print("Prediksi: Model dan scaler berhasil dimuat.")
except Exception as e:
    print(f"Error saat memuat model atau artifak prediksi: {e}", file=sys.stderr)
    model, scaler = None, None

def predict_next_day_spending(last_7_days_spending):
    """
    Fungsi untuk memprediksi pengeluaran di hari berikutnya berdasarkan 7 hari terakhir.
    - last_7_days_spending: sebuah list atau array berisi 7 angka pengeluaran.
    """
    if not all([model, scaler]):
        return None

    try:
        # 1. Ubah input list menjadi numpy array dengan bentuk (7, 1) agar bisa di-scale
        input_array = np.array(last_7_days_spending, dtype=float).reshape(-1, 1)

        # 2. Lakukan scaling pada data input menggunakan scaler yang sama
        input_scaled = scaler.transform(input_array)
        
        # 3. Reshape data agar sesuai dengan input model (1 sampel, 7 fitur/timestep)
        # Kita transpose dari (7, 1) menjadi (1, 7)
        input_reshaped = input_scaled.T

        # 4. Lakukan prediksi (hasilnya masih dalam skala 0-1)
        prediction_scaled = model.predict(input_reshaped)

        # 5. Kembalikan prediksi ke skala Rupiah asli (inverse transform)
        prediction_real_value = scaler.inverse_transform(prediction_scaled)
        
        # Kembalikan hasilnya sebagai angka float
        return float(prediction_real_value[0][0])
        
    except Exception as e:
        print(f"Error saat inferensi prediksi: {e}", file=sys.stderr)
        return None

# === CONTOH PENGGUNAAN (UNTUK DICOBA OLEH BACKEND) ===
if __name__ == '__main__':
    if len(sys.argv) > 1:
        try:
            # Contoh input dari terminal: python get_prediction.py 50000 25000 0 15000 120000 45000 30000
            input_history = [float(arg) for arg in sys.argv[1:]]
            if len(input_history) != 7:
                raise ValueError("Dibutuhkan tepat 7 angka histori pengeluaran.")

            prediksi = predict_next_day_spending(input_history)
            
            if prediksi is not None:
                # Mencetak hanya angka prediksi agar mudah ditangkap oleh script backend
                print(prediksi)
            else:
                print("Error: Gagal melakukan prediksi.", file=sys.stderr)

        except ValueError as ve:
            print(f"Input Error: {ve}", file=sys.stderr)
    else:
        print("Cara penggunaan: python get_prediction.py <7 angka histori pengeluaran dipisah spasi>", file=sys.stderr)