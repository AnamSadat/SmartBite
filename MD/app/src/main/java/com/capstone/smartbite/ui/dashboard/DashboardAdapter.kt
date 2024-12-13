package com.capstone.smartbite.ui.dashboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.capstone.smartbite.data.ListFoodItem
import com.capstone.smartbite.databinding.ItemEventactiveBinding

class DashboardAdapter (private val onItemClickListener: (ListFoodItem) -> Unit) :
    ListAdapter<ListFoodItem, DashboardAdapter.MyViewHolder>(DIFF_CALLBACK) {

    companion object {
        val DIFF_CALLBACK = object : DiffUtil.ItemCallback<ListFoodItem>() {
            override fun areItemsTheSame(
                oldItem: ListFoodItem,
                newItem: ListFoodItem
            ): Boolean {
                return oldItem.id == newItem.id
            }

            override fun areContentsTheSame(
                oldItem: ListFoodItem,
                newItem: ListFoodItem
            ): Boolean {
                return oldItem !== newItem
            }
        }
    }

    class MyViewHolder(val binding: ItemEventactiveBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(event: ListFoodItem, onItemClickListener: (ListFoodItem) -> Unit) {
            binding.nameEventActive.text = event.foodname
            Glide.with(binding.imgEventActive.context)
                .load(event.image)
                .into(binding.imgEventActive)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        val binding = ItemEventactiveBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MyViewHolder(binding)
    }

    override fun onBindViewHolder(holder: DashboardAdapter.MyViewHolder, position: Int) {
        val event = getItem(position)
        holder.bind(event, onItemClickListener)
    }

}


