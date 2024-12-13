package com.capstone.smartbite.ui.Profil

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.capstone.smartbite.FormUserPreferenceActivity
import com.capstone.smartbite.Login.LoginActivity
import com.capstone.smartbite.R
import com.capstone.smartbite.UserModel
import com.capstone.smartbite.UserPreference
import com.capstone.smartbite.databinding.FragmentProfilBinding
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth

class ProfilFragment : Fragment(), View.OnClickListener {

    private lateinit var binding: FragmentProfilBinding
    private lateinit var mUserPreference: UserPreference
    private lateinit var userModel: UserModel

    private lateinit var mGoogleSignInClient: GoogleSignInClient
    private lateinit var mAuth: FirebaseAuth

    private var isPreferenceEmpty = false

    private val resultLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result: ActivityResult ->
        if (result.data != null && result.resultCode == FormUserPreferenceActivity.RESULT_CODE) {
            userModel = result.data?.getParcelableExtra<UserModel>(FormUserPreferenceActivity.EXTRA_RESULT) as UserModel
            populateView(userModel)
            checkForm(userModel)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        binding = FragmentProfilBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        mUserPreference = UserPreference(requireContext())

        showExistingPreference()

        binding.btnSave.setOnClickListener(this)

        // Initialize Firebase Auth
        mAuth = FirebaseAuth.getInstance()

        // Configure Google Sign-In
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        mGoogleSignInClient = GoogleSignIn.getClient(requireContext(), gso)

        // Set logout button click listener
        binding.logoutButton.setOnClickListener {
            signOutAndNavigateToSignIn()
        }
    }

    private fun signOutAndNavigateToSignIn() {
        mAuth.signOut()
        mGoogleSignInClient.signOut().addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val intent = Intent(requireContext(), LoginActivity::class.java)
                startActivity(intent)
                requireActivity().finish()
            } else {
                Toast.makeText(requireContext(), "gagal logout", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun showExistingPreference() {
        userModel = mUserPreference.getUser()
        populateView(userModel)
        checkForm(userModel)
    }

    private fun populateView(userModel: UserModel) {
        binding.tvName.text =
            if (userModel.name.isNullOrEmpty()) "Tidak Ada" else userModel.name
        binding.tvAge.text =
            if (userModel.age.toString().isEmpty()) "Tidak Ada" else userModel.age.toString()
        binding.tvAdd.text =
            if (userModel.add.isNullOrEmpty()) "Tidak Ada" else userModel.add
        binding.tvEmail.text =
            if (userModel.email.isNullOrEmpty()) "Tidak Ada" else userModel.email
        binding.tvPhone.text =
            if (userModel.phoneNumber.isNullOrEmpty()) "Tidak Ada" else userModel.phoneNumber

        // Tampilkan gambar profil jika tersedia
        if (userModel.profileImage != null) {
            Glide.with(this).load(userModel.profileImage).into(binding.profileImage)
        } else {
            binding.profileImage.setImageResource(R.drawable.th)
        }
    }

    private fun checkForm(userModel: UserModel) {
        when {
            userModel.name.isNullOrEmpty().not() -> {
                binding.btnSave.text = getString(R.string.change)
                isPreferenceEmpty = false
            }
            else -> {
                binding.btnSave.text = getString(R.string.save)
                isPreferenceEmpty = true
            }
        }
    }

    override fun onClick(view: View) {
        if (view.id == R.id.btn_save) {
            val intent = Intent(requireContext(), FormUserPreferenceActivity::class.java)
            when {
                isPreferenceEmpty -> {
                    intent.putExtra(
                        FormUserPreferenceActivity.EXTRA_TYPE_FORM,
                        FormUserPreferenceActivity.TYPE_ADD
                    )
                    intent.putExtra("USER", userModel)
                }
                else -> {
                    intent.putExtra(
                        FormUserPreferenceActivity.EXTRA_TYPE_FORM,
                        FormUserPreferenceActivity.TYPE_EDIT
                    )
                    intent.putExtra("USER", userModel)
                }
            }
            resultLauncher.launch(intent)
        }
    }


}
