package com.capstone.smartbite.ui.Kamera

import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.net.toUri
import com.capstone.smartbite.R
import com.capstone.smartbite.data.FileUploadResponse
import com.capstone.smartbite.databinding.ActivityResultBinding
import com.dewakoding.androidchartjs.util.ChartType

class ResultActivity : AppCompatActivity() {
    private lateinit var binding: ActivityResultBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityResultBinding.inflate(layoutInflater)
        setContentView(binding.root)



        val imageUriy = intent.getStringExtra(EXTRA_IMAGE_URI)?.let {
            Uri.parse(it)
        }
        val resultt = intent.getStringExtra(EXTRA_RESULT)
        // Get data from intent
        val result = intent.getSerializableExtra("result") as? FileUploadResponse
        val imageUri = intent.getStringExtra("imageUri")?.toUri()

        // Display the image
        imageUri?.let {
            findViewById<ImageView>(R.id.previewImageView).setImageURI(it)
        }

        result?.let {
            binding.androidChart1.setChart(
                ChartType.PIE,
                arrayOf("Calories", "Protein", "Fat", "Carbohydrates"),
                arrayOf(it.food.nutritionInfo.calories.toFloat(),
                    it.food.nutritionInfo.protein.toString().toFloatOrNull() ?: 0f,
                    it.food.nutritionInfo.fat.toString().toFloatOrNull() ?: 0f,
                    it.food.nutritionInfo.carbohydrate.toString().toFloatOrNull() ?: 0f
                ).map { value -> value.toInt() }.toTypedArray(),
                "of quantity"
            )

        }


        // Display the result text
        result?.let {
            val resultText = String.format(
                "Food: %s\nCalories: %d\nProtein: %.2fg\nFat: %.2fg\nCarbohydrates: %.2fg\nConfidence: %.2f%%",
                it.food.foodName,
                it.food.nutritionInfo.calories,
                it.food.nutritionInfo.protein.toString().toFloatOrNull() ?: 0f,
                it.food.nutritionInfo.fat.toString().toFloatOrNull() ?: 0f,
                it.food.nutritionInfo.carbohydrate.toString().toFloatOrNull() ?: 0f,
                (it.food.probability.toFloatOrNull() ?: 0f) * 100
            )
            findViewById<TextView>(R.id.resultTextView).text = resultText
        } ?: Log.e("ResultActivity", "No result received!")
    }


    companion object {
        const val EXTRA_IMAGE_URI = "extra_image_uri"
        const val EXTRA_RESULT = "extra_result"
    }
}