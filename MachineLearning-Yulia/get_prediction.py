import tensorflow as tf
import numpy as np
import pickle
import sys
import os

# --- Muat semua file yang dibutuhkan ---
try:
    # Dapatkan path direktori di mana script ini berada
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Gabungkan path direktori dengan nama file-file artifak
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
        # Mengembalikan None jika model gagal dimuat, agar backend bisa menangani error
        return None

    try:
        # 1. Pastikan input adalah numpy array
        input_array = np.array(last_7_days_spending, dtype=float).reshape(1, -1)

        # 2. Lakukan scaling pada data input menggunakan scaler yang SAMA saat training
        input_scaled = scaler.transform(input_array)
        
        # 3. Reshape data agar sesuai dengan input model (1 sampel, 7 fitur/timestep)
        input_reshaped = input_scaled.reshape(1, 7)

        # 4. Lakukan prediksi
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
    # Simulasi data yang diterima dari request API
    # Backend mengirim 7 angka pengeluaran terakhir sebagai argumen command line
    if len(sys.argv) > 1:
        # Ambil semua argumen setelah nama script, ubah ke float
        try:
            # Contoh input dari terminal: python get_prediction.py 50000 25000 0 15000 120000 45000 30000
            input_history = [float(arg) for arg in sys.argv[1:]]
            if len(input_history) != 7:
                raise ValueError("Dibutuhkan tepat 7 angka histori pengeluaran.")

            prediksi = predict_next_day_spending(input_history)
            
            if prediksi is not None:
                print(f"Histori Input: {input_history}")
                print(f"Prediksi Pengeluaran Besok: {prediksi:,.0f}")
            else:
                print("Gagal melakukan prediksi.")

        except ValueError as ve:
            print(f"Input Error: {ve}")
    else:
        print("Cara penggunaan: python get_prediction.py <7 angka histori pengeluaran dipisah spasi>")