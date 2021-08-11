package com.iplayya;

import android.content.Intent;
import android.os.Bundle;

//import android.support.v7.app.AppCompatActivity;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Intent intent = new Intent(this, MainActivity.class);
    // intent.putExtras(getIntent().getExtras());
    startActivity(intent);
    finish();
  }
}
