using System;
using System.IO;

public class Program
{
    public static void Main(string[] Args)
    {
        if (Args.Length != 3)
        {
            Console.WriteLine("ForwardDFT.exe [input_file] [sampling_rate] [output_file]");
            return;
        }

        string input_file = Args[0];
        double sampling_rate = Convert.ToDouble(Args[1]);
        string output_file = Args[2];

        int N = 0;

        StreamReader SR = new StreamReader(input_file);
        while (SR.ReadLine() != null) N++;
        SR.Close();

        if (N % 2 != 0)
        {
            Console.WriteLine("N must be an even number.");
            return;
        }

        double[] x = new double[N];

        SR = new StreamReader(input_file);
        for (int i = 0; i < N; i++)
        {
            x[i] = Convert.ToDouble(SR.ReadLine());
            Console.WriteLine($"x[{i}] = {x[i]}");
        }
        SR.Close();


        // DFT: page 158
        double[] ReX = new double[(N / 2) + 1];
        double[] ImX = new double[(N / 2) + 1];

        for (int k = 0; k < (N / 2) + 1; k++){
            ReX[k] = ImX[k] = 0;
            for (int i = 0; i < N; i++) {
                ReX[k] += x[i] * Math.Cos((2 * Math.PI * k * i) / N);
                ImX[k] += -x[i] * Math.Sin((2 * Math.PI * k * i) / N);
            }
            ReX[k] = Math.Round(ReX[k]);
            ImX[k] = Math.Round(ImX[k]);
            if (ReX[k] == 0) ReX[k] = 0;
            if (ImX[k] == 0) ImX[k] = 0;
            // printf ReX[k], ImX[k];
            // printf "ReX[%d] = %f, ImX[%d] = %f\n", k, ReX[k], k, ImX[k];
            Console.WriteLine($"ReX[{k}] = {ReX[k]}, ImX[{k}] = {ImX[k]}");
        }


        // Normalization: page 153
        double[] ReX_ = new double[(N / 2) + 1];
        double[] ImX_ = new double[(N / 2) + 1];

        for (int k = 0; k < (N / 2) + 1; k++) {

            ReX_[k] = ReX[k] / (double)((N / 2)+1);
            ImX_[k] = -ImX[k] / (double)((N / 2)+1);


            if (k == 0) ReX_[0] = ReX[0] / (double)N;
            if (k == (N / 2) + 1) ReX_[(N / 2) + 1] = ReX[(N / 2) + 1] / (double)N;
        }

        StreamWriter SW = new StreamWriter(output_file);

        SW.WriteLine("k\tReX_[k]\tImX_[k]\tfrequency");
        for (int k = 0; k < (N / 2) + 1; k++) {

            double fraction = (double)k / (double)N;
            ReX_[k] = Math.Round(ReX_[k]);
            ImX_[k] = Math.Round(ImX_[k]);
            if (ReX_[k] == 0) ReX_[k] = 0;
            if (ImX_[k] == 0) ImX_[k] = 0;
            SW.WriteLine(k + "\t" + ReX_[k] + "\t" + ImX_[k] + "\t" + String.Format("{0:0.000000}", fraction * sampling_rate));
        }

        SW.Close();
    }
}
