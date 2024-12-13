package com.capstone.smartbite.ui.Kamera

import android.Manifest
import android.app.Activity.RESULT_CANCELED
import android.app.Activity.RESULT_OK
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.capstone.smartbite.R
import com.capstone.smartbite.data.ApiConfig
import com.capstone.smartbite.data.FileUploadResponse
import com.capstone.smartbite.databinding.FragmentCameraBinding
import com.google.gson.Gson
import com.yalantis.ucrop.UCrop
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import org.tensorflow.lite.task.vision.classifier.Classifications
import retrofit2.HttpException
import java.io.File

class CameraFragment : Fragment(){



    private lateinit var binding: FragmentCameraBinding


    private var currentImageUri: Uri? = null
    private var imageUri: Uri? = null

    private val requestPermissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { isGranted: Boolean ->
            if (isGranted) {
                Toast.makeText(requireContext(), "Permission request granted", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(requireContext(), "Permission request denied", Toast.LENGTH_LONG).show()
            }
        }

    private fun allPermissionsGranted() =
        ContextCompat.checkSelfPermission(
            requireContext(),
            REQUIRED_PERMISSION
        ) == PackageManager.PERMISSION_GRANTED

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Pulihkan data jika ada
        savedInstanceState?.let {
            currentImageUri = it.getParcelable(CURRENT_IMAGE_URI_KEY)
            imageUri = it.getParcelable(IMAGE_URI_KEY)
        }
    }



    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentCameraBinding.inflate(inflater, container, false)

        // Set klik listener
        binding.cardcamera.setOnClickListener { startCamera() }
        binding.cardgaleri.setOnClickListener { startGallery() }
        binding.buttonAnalisa.setOnClickListener { uploadImage() }

        // Tampilkan gambar yang sudah ada
        imageUri?.let {
            binding.gambaruplode.setImageURI(it)
            binding.buttonAnalisa.visibility = View.VISIBLE
        } ?: run {
            binding.gambaruplode.setImageResource(R.drawable.baseline_image_24)
            binding.buttonAnalisa.visibility = View.GONE
        }

        return binding.root
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        // Simpan URI ke dalam Bundle
        currentImageUri?.let { outState.putParcelable(CURRENT_IMAGE_URI_KEY, it) }
        imageUri?.let { outState.putParcelable(IMAGE_URI_KEY, it) }
    }


    private fun startCamera() {
        currentImageUri = getImageUri(requireContext())
        launcherIntentCamera.launch(currentImageUri!!)
    }

    private val launcherIntentCamera = registerForActivityResult(
        ActivityResultContracts.TakePicture()
    ) { isSuccess ->
        if (isSuccess) {
            // Setelah pengambilan gambar berhasil, simpan URI gambar ke ViewModel

            // Tampilkan gambar hasil pengambilan kamera
            showImage()

            // Lakukan analisis gambar setelah gambar disimpa
        } else {
            currentImageUri = null
            showToast("Pengambilan gambar dibatalkan")
        }
    }

    private fun startGallery() {
        val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
            type = "image/*"
        }
        val chooser = Intent.createChooser(intent, "Pilih gambar")
        launcherIntentGallery.launch(chooser)
    }

    private val launcherIntentGallery = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val selectedImg = result.data?.data as Uri
            selectedImg.let { uri ->
                currentImageUri = uri
                startCrop(selectedImg)
            }
        }
    }

    private fun startCrop(imageUri: Uri) {
        val destinationUri = Uri.fromFile(File(requireContext().cacheDir, "cropped_image_${System.currentTimeMillis()}.jpg"))

        val uCrop = UCrop.of(imageUri, destinationUri)
            .withAspectRatio(1f, 1f)
            .withMaxResultSize(224, 224)
            .getIntent(requireContext())

        cropImageResultLauncher.launch(uCrop)
    }

    private val cropImageResultLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val resultUri = UCrop.getOutput(result.data!!)
            resultUri?.let {
                currentImageUri = it
                showImage()
            }
        } else if (result.resultCode == UCrop.RESULT_ERROR) {
            val cropError = UCrop.getError(result.data!!)
            cropError?.let { showToast("Ada kesalahan crop gambar: ${it.message}") }
        } else if (result.resultCode == RESULT_CANCELED) {
            showToast("Crop dibatalkan")
            binding.gambaruplode.setImageResource(R.drawable.baseline_image_24)
            binding.buttonAnalisa.visibility = View.GONE
        }
    }

    private fun showImage() {
        currentImageUri?.let {
            binding.gambaruplode.setImageURI(it)
            binding.buttonAnalisa.visibility = View.VISIBLE
        }
    }

    private fun uploadImage() {
        currentImageUri?.let { uri ->
            val imageFile = uriToFile(uri, requireContext())
            showLoading(true)
            val requestImageFile = imageFile.asRequestBody("image/jpeg".toMediaType())
            val multipartBody = MultipartBody.Part.createFormData(
                "image",
                imageFile.name,
                requestImageFile
            )

            lifecycleScope.launch {
                try {
                    val apiService = ApiConfig.getApiService()
                    val response = apiService.uploadImage(multipartBody)

                    // Navigate to ResultActivity with data
                    val intent = Intent(requireContext(), ResultActivity::class.java)
                    intent.putExtra("result", response)
                    intent.putExtra("imageUri", uri.toString()) // Send image URI
                    startActivity(intent)

                } catch (e: HttpException) {
                    val errorBody = e.response()?.errorBody()?.string()
                    val errorResponse = Gson().fromJson(errorBody, FileUploadResponse::class.java)
                    showToast(errorResponse.message)
                } catch (e: Exception) {
                    Log.e("Upload Image", "Unexpected error: ${e.message}")
                    showToast("An unexpected error occurred. Please try again.")
                } finally {
                    showLoading(false)
                }
            }
        } ?: showToast(getString(R.string.empty_image_warning))
    }

    fun onError(error: String) {
        binding.progressIndicator.visibility = View.GONE
        showToast("Terjadi kesalahan: $error")
    }

    fun onResults(results: List<Classifications>?, inferenceTime: Long) {
        TODO("Not yet implemented")
    }

    private fun moveToResult(result: String) {
        val intent = Intent(requireContext(), ResultActivity::class.java).apply {
            putExtra(ResultActivity.EXTRA_IMAGE_URI, currentImageUri.toString())
            putExtra(ResultActivity.EXTRA_RESULT, result)
        }
        startActivity(intent)
    }

    private fun showToast(message: String) {
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }

    private fun showLoading(isLoading: Boolean) {
        binding.progressIndicator.visibility = if (isLoading) View.VISIBLE else View.GONE
    }
    companion object {
        private const val REQUIRED_PERMISSION = Manifest.permission.CAMERA
        private const val CURRENT_IMAGE_URI_KEY = "currentImageUri"
        private const val IMAGE_URI_KEY = "imageUri"
    }

}
