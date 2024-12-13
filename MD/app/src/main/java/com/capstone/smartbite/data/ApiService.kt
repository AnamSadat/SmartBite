package com.capstone.smartbite.data

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Query

interface ApiService {
    @Multipart
    @POST("/predict")
    suspend fun uploadImage(
        @Part file: MultipartBody.Part
    ): FileUploadResponse

    @GET("recomendation")
    fun getcalorie(
        @Query("calorie") calorie: Int
    ): Call<RecomenResponse>
}